from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Webhook URLs - configure these in production
WORKER_WEBHOOK_URL = os.environ.get('WORKER_WEBHOOK_URL', 'YOUR_WEBHOOK_URL_HERE')
CLIENT_WEBHOOK_URL = os.environ.get('CLIENT_WEBHOOK_URL', 'YOUR_WEBHOOK_URL_HERE')


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class WorkerSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: EmailStr
    phone: str
    primary_trade: str
    years_experience: str
    nstc_card: str
    anchorage_travel: str
    availability: str
    resume_filename: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_content: Optional[str] = None
    utm_term: Optional[str] = None
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "pending"


class WorkerSubmissionCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    primary_trade: str
    years_experience: str
    nstc_card: str
    anchorage_travel: str
    availability: str
    resume_filename: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_content: Optional[str] = None
    utm_term: Optional[str] = None


class ClientSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_name: str
    contact_name: str
    role_title: str
    trades_needed: List[str]
    workers_required: int
    project_location: str
    start_date: str
    email: EmailStr
    phone: str
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_content: Optional[str] = None
    utm_term: Optional[str] = None
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "pending"


class ClientSubmissionCreate(BaseModel):
    company_name: str
    contact_name: str
    role_title: str
    trades_needed: List[str]
    workers_required: int
    project_location: str
    start_date: str
    email: EmailStr
    phone: str
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_content: Optional[str] = None
    utm_term: Optional[str] = None


# API Routes
@api_router.get("/")
async def root():
    return {"message": "North Slope Trades API"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


@api_router.post("/worker-submission")
async def submit_worker_form(submission: WorkerSubmissionCreate):
    """Submit worker intake form"""
    # Create submission object
    worker_obj = WorkerSubmission(**submission.model_dump())
    
    # Convert to dict for MongoDB
    doc = worker_obj.model_dump()
    doc['submitted_at'] = doc['submitted_at'].isoformat()
    
    # Store in MongoDB
    await db.worker_submissions.insert_one(doc)
    
    # Try to send to webhook if configured
    if WORKER_WEBHOOK_URL and WORKER_WEBHOOK_URL != 'YOUR_WEBHOOK_URL_HERE':
        try:
            async with httpx.AsyncClient() as http_client:
                await http_client.post(
                    WORKER_WEBHOOK_URL,
                    json=doc,
                    timeout=10.0
                )
        except Exception as e:
            logger.warning(f"Failed to send worker webhook: {e}")
    
    return {
        "success": True,
        "message": "Submission received",
        "id": worker_obj.id
    }


@api_router.post("/client-submission")
async def submit_client_form(submission: ClientSubmissionCreate):
    """Submit client/operator request form"""
    # Create submission object
    client_obj = ClientSubmission(**submission.model_dump())
    
    # Convert to dict for MongoDB
    doc = client_obj.model_dump()
    doc['submitted_at'] = doc['submitted_at'].isoformat()
    
    # Store in MongoDB
    await db.client_submissions.insert_one(doc)
    
    # Try to send to webhook if configured
    if CLIENT_WEBHOOK_URL and CLIENT_WEBHOOK_URL != 'YOUR_WEBHOOK_URL_HERE':
        try:
            async with httpx.AsyncClient() as http_client:
                await http_client.post(
                    CLIENT_WEBHOOK_URL,
                    json=doc,
                    timeout=10.0
                )
        except Exception as e:
            logger.warning(f"Failed to send client webhook: {e}")
    
    return {
        "success": True,
        "message": "Request received",
        "id": client_obj.id
    }


@api_router.get("/worker-submissions", response_model=List[WorkerSubmission])
async def get_worker_submissions():
    """Get all worker submissions (admin endpoint)"""
    submissions = await db.worker_submissions.find({}, {"_id": 0}).to_list(1000)
    
    for sub in submissions:
        if isinstance(sub['submitted_at'], str):
            sub['submitted_at'] = datetime.fromisoformat(sub['submitted_at'])
    
    return submissions


@api_router.get("/client-submissions", response_model=List[ClientSubmission])
async def get_client_submissions():
    """Get all client submissions (admin endpoint)"""
    submissions = await db.client_submissions.find({}, {"_id": 0}).to_list(1000)
    
    for sub in submissions:
        if isinstance(sub['submitted_at'], str):
            sub['submitted_at'] = datetime.fromisoformat(sub['submitted_at'])
    
    return submissions


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
