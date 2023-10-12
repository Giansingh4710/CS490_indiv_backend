const request = require('supertest');
const app = require('../app'); // Import your Express app here

describe('Express API', () => {
  describe('GET /landing/top5movies', () => {
    it('should return an array of top 5 movies', async () => {
      const response = await request(app).get('/landing/top5movies');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(5); // Assuming it returns top 5 movies
    });
  });
  
  describe('GET /landing/movieDetail', () => {
    it('should get correct movie detail', async () => {
      const response = await request(app).get('/landing/movieDetail?movie=BUCKET BROTHERHOOD');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].film_id).toBe(103);
    });
  });

  describe('GET /landing/top5actors', () => {
    it('should get 5 actors', async () => {
      const response = await request(app).get('/landing/top5actors');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(5);
    });
  });

  describe('GET /landing/actorDetail', () => {
    it('should get correct movie detail', async () => {
      const response = await request(app).get('/landing/actorDetail?actor_id=42');
      expect(response.status).toBe(200);
      expect(response.body.actor_detail.last_name).toBe("MIRANDA");
    });
  });

  describe('GET /movies/search', () => {
    it('should get correct movies when search by film', async () => {
      const response = await request(app).get('/movies/search?type=film&search=BUCKET');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].film_id).toBe(103);
      expect(response.body[1].film_id).toBe(162);
    });
  });
// http://127.0.0.1:1313/
});

