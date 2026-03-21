#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class NorthSlopeTradesAPITester:
    def __init__(self, base_url="https://arctic-trades.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:500]}")
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:500]
                })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'test': name,
                'error': str(e)
            })
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test(
            "API Root",
            "GET",
            "api/",
            200
        )

    def test_worker_submission(self):
        """Test worker form submission"""
        worker_data = {
            "full_name": "John Doe",
            "email": "john.doe@example.com",
            "phone": "+1-555-123-4567",
            "primary_trade": "welder",
            "years_experience": "5-10",
            "nstc_card": "yes",
            "anchorage_travel": "yes",
            "availability": "immediately",
            "resume_filename": "john_doe_resume.pdf",
            "utm_source": "test",
            "utm_medium": "api_test",
            "utm_campaign": "backend_testing"
        }
        
        return self.run_test(
            "Worker Form Submission",
            "POST",
            "api/worker-submission",
            200,
            data=worker_data
        )

    def test_worker_submission_knockout(self):
        """Test worker form submission with knockout conditions"""
        worker_data = {
            "full_name": "Jane Smith",
            "email": "jane.smith@example.com", 
            "phone": "+1-555-987-6543",
            "primary_trade": "pipefitter",
            "years_experience": "3-5",
            "nstc_card": "no",
            "anchorage_travel": "no",
            "availability": "2_weeks"
        }
        
        return self.run_test(
            "Worker Form Submission (Knockout Case)",
            "POST",
            "api/worker-submission",
            200,
            data=worker_data
        )

    def test_client_submission(self):
        """Test client form submission"""
        client_data = {
            "company_name": "Arctic Energy Corp",
            "contact_name": "Mike Johnson",
            "role_title": "Operations Manager",
            "trades_needed": ["Welder", "Pipefitter", "Heavy Equipment Operator"],
            "workers_required": 5,
            "project_location": "Prudhoe Bay",
            "start_date": "2025-09-01",
            "email": "mike.johnson@arcticenergy.com",
            "phone": "+1-555-444-7777",
            "utm_source": "test",
            "utm_medium": "api_test",
            "utm_campaign": "backend_testing"
        }
        
        return self.run_test(
            "Client Form Submission",
            "POST",
            "api/client-submission",
            200,
            data=client_data
        )

    def test_get_worker_submissions(self):
        """Test getting worker submissions"""
        return self.run_test(
            "Get Worker Submissions",
            "GET",
            "api/worker-submissions",
            200
        )

    def test_get_client_submissions(self):
        """Test getting client submissions"""
        return self.run_test(
            "Get Client Submissions",
            "GET",
            "api/client-submissions",
            200
        )

    def test_status_check_create(self):
        """Test status check creation"""
        status_data = {
            "client_name": "Test Client"
        }
        
        return self.run_test(
            "Create Status Check",
            "POST",
            "api/status",
            200,
            data=status_data
        )

    def test_status_check_get(self):
        """Test getting status checks"""
        return self.run_test(
            "Get Status Checks",
            "GET",
            "api/status",
            200
        )

def main():
    print("🚀 Starting North Slope Trades API Testing...")
    print(f"⏰ Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Setup
    tester = NorthSlopeTradesAPITester()

    # Run all tests
    print("\n" + "="*60)
    print("BACKEND API TESTING")
    print("="*60)

    # Test API root
    tester.test_api_root()

    # Test status endpoints
    tester.test_status_check_create()
    tester.test_status_check_get()

    # Test worker submission endpoints
    tester.test_worker_submission()
    tester.test_worker_submission_knockout()
    tester.test_get_worker_submissions()

    # Test client submission endpoints
    tester.test_client_submission()
    tester.test_get_client_submissions()

    # Print results
    print("\n" + "="*60)
    print("TEST RESULTS SUMMARY")
    print("="*60)
    print(f"📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    if tester.failed_tests:
        print(f"\n❌ Failed tests:")
        for i, failure in enumerate(tester.failed_tests, 1):
            print(f"   {i}. {failure.get('test', 'Unknown')}")
            if 'error' in failure:
                print(f"      Error: {failure['error']}")
            else:
                print(f"      Expected: {failure.get('expected')}, Got: {failure.get('actual')}")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"\n📈 Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())