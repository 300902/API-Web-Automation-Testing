const request = require('supertest');
const axios = require('axios');

// Base URL for API testing
const BASE_URL = process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com';

describe('API Automation Tests', () => {
  describe('GET Endpoints', () => {
    test('should get all posts', async () => {
      const response = await axios.get(`${BASE_URL}/posts`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });

    test('should get a specific post by ID', async () => {
      const postId = 1;
      const response = await axios.get(`${BASE_URL}/posts/${postId}`);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id', postId);
      expect(response.data).toHaveProperty('title');
      expect(response.data).toHaveProperty('body');
    });

    test('should return 404 for non-existent post', async () => {
      try {
        await axios.get(`${BASE_URL}/posts/9999`);
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('POST Endpoints', () => {
    test('should create a new post', async () => {
      const newPost = {
        title: 'Test Post',
        body: 'This is a test post created by automation',
        userId: 1
      };

      const response = await axios.post(`${BASE_URL}/posts`, newPost);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.title).toBe(newPost.title);
      expect(response.data.body).toBe(newPost.body);
      expect(response.data.userId).toBe(newPost.userId);
    });

    test('should validate required fields when creating post', async () => {
      const invalidPost = {
        body: 'Post without title'
      };

      try {
        await axios.post(`${BASE_URL}/posts`, invalidPost);
      } catch (error) {
        // Depending on API implementation, this might be 400 or other status
        expect([400, 422]).toContain(error.response?.status);
      }
    });
  });

  describe('PUT Endpoints', () => {
    test('should update an existing post', async () => {
      const postId = 1;
      const updatedPost = {
        id: postId,
        title: 'Updated Test Post',
        body: 'This post has been updated by automation',
        userId: 1
      };

      const response = await axios.put(`${BASE_URL}/posts/${postId}`, updatedPost);
      
      expect(response.status).toBe(200);
      expect(response.data.title).toBe(updatedPost.title);
      expect(response.data.body).toBe(updatedPost.body);
    });
  });

  describe('DELETE Endpoints', () => {
    test('should delete a post', async () => {
      const postId = 1;
      const response = await axios.delete(`${BASE_URL}/posts/${postId}`);
      
      expect(response.status).toBe(200);
    });
  });

  describe('Authentication Tests', () => {
    test('should handle unauthorized access', async () => {
      // Example for protected endpoint
      try {
        await axios.get(`${BASE_URL}/protected-endpoint`, {
          headers: {
            'Authorization': 'Bearer invalid-token'
          }
        });
      } catch (error) {
        expect(error.response?.status).toBe(401);
      }
    });
  });

  describe('Performance Tests', () => {
    test('should respond within acceptable time limits', async () => {
      const startTime = Date.now();
      const response = await axios.get(`${BASE_URL}/posts`);
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      
      expect(response.status).toBe(200);
      expect(responseTime).toBeLessThan(2000); // Should respond within 2 seconds
    });
  });
});
