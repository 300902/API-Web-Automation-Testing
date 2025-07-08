import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
export const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up to 10 users over 2 minutes
    { duration: '5m', target: 10 }, // Stay at 10 users for 5 minutes
    { duration: '2m', target: 20 }, // Ramp up to 20 users over 2 minutes
    { duration: '5m', target: 20 }, // Stay at 20 users for 5 minutes
    { duration: '2m', target: 0 },  // Ramp down to 0 users over 2 minutes
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
    http_req_failed: ['rate<0.1'],     // Error rate should be less than 10%
    errors: ['rate<0.1'],              // Custom error rate should be less than 10%
  },
};

// Base URL from environment or default
const BASE_URL = __ENV.API_BASE_URL || 'https://jsonplaceholder.typicode.com';

export default function () {
  // Test scenario 1: Get all posts
  let response = http.get(`${BASE_URL}/posts`);
  
  let checkResult = check(response, {
    'GET /posts status is 200': (r) => r.status === 200,
    'GET /posts response time < 2s': (r) => r.timings.duration < 2000,
    'GET /posts has content': (r) => r.body.length > 0,
  });
  
  errorRate.add(!checkResult);
  
  sleep(1);
  
  // Test scenario 2: Get specific post
  const postId = Math.floor(Math.random() * 100) + 1;
  response = http.get(`${BASE_URL}/posts/${postId}`);
  
  checkResult = check(response, {
    'GET /posts/{id} status is 200': (r) => r.status === 200,
    'GET /posts/{id} response time < 1s': (r) => r.timings.duration < 1000,
    'GET /posts/{id} has id field': (r) => JSON.parse(r.body).id === postId,
  });
  
  errorRate.add(!checkResult);
  
  sleep(1);
  
  // Test scenario 3: Create new post
  const payload = JSON.stringify({
    title: `Performance Test Post ${__VU}-${__ITER}`,
    body: 'This is a test post created during performance testing',
    userId: Math.floor(Math.random() * 10) + 1,
  });
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  response = http.post(`${BASE_URL}/posts`, payload, params);
  
  checkResult = check(response, {
    'POST /posts status is 201': (r) => r.status === 201,
    'POST /posts response time < 3s': (r) => r.timings.duration < 3000,
    'POST /posts returns created post': (r) => {
      const responseBody = JSON.parse(r.body);
      return responseBody.title && responseBody.body && responseBody.userId;
    },
  });
  
  errorRate.add(!checkResult);
  
  sleep(2);
  
  // Test scenario 4: Get users
  response = http.get(`${BASE_URL}/users`);
  
  checkResult = check(response, {
    'GET /users status is 200': (r) => r.status === 200,
    'GET /users response time < 1.5s': (r) => r.timings.duration < 1500,
    'GET /users returns array': (r) => Array.isArray(JSON.parse(r.body)),
  });
  
  errorRate.add(!checkResult);
  
  sleep(1);
}

// Setup function (runs once at the beginning)
export function setup() {
  console.log('🚀 Starting performance test...');
  console.log(`📊 Target URL: ${BASE_URL}`);
  console.log(`⏱️  Test duration: ~16 minutes`);
  console.log(`👥 Max users: 20`);
  return { startTime: new Date() };
}

// Teardown function (runs once at the end)
export function teardown(data) {
  const endTime = new Date();
  const duration = (endTime - data.startTime) / 1000;
  console.log(`✅ Performance test completed in ${duration.toFixed(2)} seconds`);
}
