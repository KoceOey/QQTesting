const request = require('supertest');
const app = require('../../app');
const fs = require('fs');
const path = require('path');

describe('Integration Tests', () => {
  let token
  let propertyId

  test('should login with agent data', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'asep@gmail.com',
        password: 'asep123'
      })
      token = res.header['authorization'];
      console.log(token)
      expect(res.statusCode).toBe(200)
      expect(res.body.result.type).toBe(1)
  })

  test('should add new listing if user is logged in as a agent', async () => {
    const imageFilePath1 = path.join(__dirname, './uploads/rumah1.jpg');
    const imageFile1 = fs.readFileSync(imageFilePath1);

    const imageFilePath2 = path.join(__dirname, './uploads/rumah2.jpg');
    const imageFile2 = fs.readFileSync(imageFilePath2);

    const imageFilePath3 = path.join(__dirname, './uploads/rumah3.jpg');
    const imageFile3 = fs.readFileSync(imageFilePath3);

    const imageFilePath4 = path.join(__dirname, './uploads/rumah4.jpg');
    const imageFile4 = fs.readFileSync(imageFilePath4);

    const imageFilePath5 = path.join(__dirname, './uploads/rumah5.jpg');
    const imageFile5 = fs.readFileSync(imageFilePath5);

    const res = await request(app)
      .post('/property')
      .set("authorization", token)
      .field('title', 'Rumah bagus')
      .field('desc', 'Rumah bagus sekali')
      .field('type', 'House')
      .field('area', 'Bandung')
      .field('price', '1000000000')
      .field('bedroomCount', '2')
      .field('bathroomCount', '2')
      .field('landArea', '500')
      .field('garage', 'true')
      .field('floorLevel', '2')
      .attach('images', imageFile1, 'gambar1.jpg') // Melampirkan gambar pertama
      .attach('images', imageFile2, 'gambar2.jpg') // Melampirkan gambar kedua
      .attach('images', imageFile3, 'gambar3.jpg') // Melampirkan gambar ketiga
      .attach('images', imageFile4, 'gambar4.jpg') // Melampirkan gambar keempat
      .attach('images', imageFile5, 'gambar5.jpg'); // Melampirkan gambar kelima

      propertyId = res.body.propertyId
      expect(res.statusCode).toBe(201)
  })

  test('should login with admin data', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'suep@gmail.com',
        password: 'suep123'
      })
      token = res.header['authorization'];
      expect(res.statusCode).toBe(200)
      expect(res.body.result.type).toBe(0)
  })

  test('should approve property as a admin', async () => {
    const res = await request(app)
      .put('/property')
      .set("authorization", token)
      .send({
        propertyId: propertyId,
      })
      expect(res.statusCode).toBe(200)
  })

  test('should get property as a guest', async () => {
    const res = await request(app)
      .post('/getproperty')
      .send({
        id: propertyId,
      })
      console.log(res.body.data)
      expect(res.statusCode).toBe(200)
  })
})