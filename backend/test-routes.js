import fetch from 'node-fetch';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

console.log('🧪 Testing Trip Buddy Backend API\n');
console.log(`Base URL: ${BASE_URL}\n`);

const tests = [
  {
    name: 'Health Check',
    method: 'GET',
    endpoint: '/api/health',
    expectedStatus: 200
  },
  {
    name: 'Root Endpoint',
    method: 'GET',
    endpoint: '/',
    expectedStatus: 200
  },
  {
    name: 'Get Flights',
    method: 'GET',
    endpoint: '/api/flights?limit=5',
    expectedStatus: 200
  },
  {
    name: 'Get Trains',
    method: 'GET',
    endpoint: '/api/trains?limit=5',
    expectedStatus: 200
  },
  {
    name: 'Get Taxis',
    method: 'GET',
    endpoint: '/api/taxis?limit=5',
    expectedStatus: 200
  },
  {
    name: 'Get Hotels',
    method: 'GET',
    endpoint: '/api/hotels?limit=5',
    expectedStatus: 200
  }
];

async function runTest(test) {
  try {
    const url = `${BASE_URL}${test.endpoint}`;
    const response = await fetch(url, { method: test.method });
    const status = response.status;
    const data = await response.json();
    
    const passed = status === test.expectedStatus;
    const icon = passed ? '✅' : '❌';
    
    console.log(`${icon} ${test.name}`);
    console.log(`   Status: ${status} (expected ${test.expectedStatus})`);
    
    if (passed) {
      console.log(`   Response:`, JSON.stringify(data).substring(0, 100) + '...');
    } else {
      console.log(`   Error:`, data);
    }
    console.log('');
    
    return passed;
  } catch (error) {
    console.log(`❌ ${test.name}`);
    console.log(`   Error: ${error.message}`);
    console.log('');
    return false;
  }
}

async function runAllTests() {
  console.log('Starting tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await runTest(test);
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('═══════════════════════════════════════');
  console.log(`Results: ${passed} passed, ${failed} failed out of ${tests.length} tests`);
  console.log('═══════════════════════════════════════\n');
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Backend is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
    console.log('   Make sure:');
    console.log('   1. Backend server is running (npm run dev)');
    console.log('   2. Data files exist in backend/data/ folder');
    console.log('   3. Environment variables are configured');
  }
}

runAllTests().catch(console.error);
