const request = require('supertest');
const app = require('../../app');
const fs = require('fs');
const path = require('path');

test('should add new listing if user is logged in as a agent', async () => {
    const imageFilePath1 = path.join(__dirname, './uploads/rumah1.jpg');

    const res = await request(app)
      .post('/property')
      .set("authorization", token)
      .field('name', '')
      .field('desc', 'Rumah bagus sekali')
      .field('type', 'House')
      .field('area', 'Bandung')
      .field('price', '1000000000')
      .field('bedroomCount', '2')
      .field('bathroomCount', '2')
      .field('landArea', '500')
      .field('garage', 'true')
      .field('floorLevel', '2')
      .attach('images', imageFile1, 'gambar1.jpg') // Melampirkan gambar

      propertyId = res.body.propertyId
      expect(res.statusCode).toBe(201)
  })