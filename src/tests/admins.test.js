import request from 'supertest';
import app from '../app';
import Admin from '../models/Admin';
import adminsSeed from '../seeds/admins';

beforeAll(async () => {
  await Admin.collection.insertMany(adminsSeed);
});

const adminValidId = '635437ebfc13ae2db70002b9';
const adminInvalidId = '635437ebfc13ae2db7000000';
const mockedAdmin = {
  name: 'Nobie',
  lastName: 'Sciusscietto',
  email: 'nsciusscietto1@booking.com',
  password: '9WU3XhyA',
};
const emptyMockedAdmin = {
  name: '',
  lastName: '',
  email: '',
  password: '',
};

describe('POST /admin', () => {
  test('Should return status code 201 with a proper admin', async () => {
    const response = await request(app)
      .post('/api/admin/')
      .send(mockedAdmin);
    expect(response.status).toBe(201);
  });

  test('Should return error false with a proper admin', async () => {
    const response = await request(app)
      .post('/api/admin/')
      .send(mockedAdmin);
    expect(response.body.error).toBeFalsy();
  });

  test('Should return not undefined data with a proper admin', async () => {
    const response = await request(app)
      .post('/api/admin/')
      .send(mockedAdmin);
    expect(response.body.data).not.toBeUndefined();
  });

  test('Should return a correct message with a proper admin', async () => {
    const response = await request(app)
      .post('/api/admin/')
      .send(mockedAdmin);
    expect(response.body.message).toEqual('New admin successfully created.');
  });

  test('Name minimum length of 3', async () => {
    const response = await request(app)
      .post('/api/admin/')
      .send(mockedAdmin);
    expect(response.body.data.name.length).toBeGreaterThan(3);
  });
});

describe('PUT /api/admin/:id', () => {
  test('Should return status code 200 with a valid ID', async () => {
    const response = await request(app)
      .put(`/api/admin/${adminValidId}`)
      .send(mockedAdmin);
    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBe(`${response.body.message}`);
  });

  test('Should return status code 500 with an invalid ID', async () => {
    const response = await request(app)
      .put('/api/admin/adsd')
      .send(mockedAdmin);
    expect(response.status).toBe(500);
    expect(response.body.data).toBeUndefined();
  });

  test('Should return status code 404 with an empty ID', async () => {
    const response = await request(app)
      .put('/api/admin/')
      .send(mockedAdmin);
    expect(response.status).toBe(404);
    expect(response.body.data).toBeUndefined();
    expect(response.body.message).toBe(undefined);
  });

  test('Should return status code 400 with an empty body', async () => {
    const response = await request(app)
      .put(`/api/admin/${adminValidId}`)
      .send(emptyMockedAdmin);
    expect(response.status).toBe(400);
    expect(response.body.data).toBeUndefined();
    expect(response.body.message).toBe(`${response.body.message}`);
  });
});

describe('DELETE /admin/:id', () => {
  test('Should return status code 500 with an empty ID', async () => {
    const response = await request(app)
      .delete(`/api/admin/${null}`)
      .send();
    expect(response.status).toBe(500);
  });

  test('Should return status code 404 With an incorrect route', async () => {
    const response = await request(app)
      .delete(`/api/empls/${adminInvalidId}`)
      .send();
    expect(response.status).toBe(404);
  });

  test('Should return status code 404 with an empty body', async () => {
    const response = await request(app)
      .delete('/api/admin/')
      .send({});
    expect(response.status).toBe(404);
  });

  test('Should return data undefined with an nonexistent id', async () => {
    const response = await request(app)
      .delete('/api/admin/635437ebfc13ae2db700000a')
      .send();
    expect(response.body.data).toBeUndefined();
  });

  test('Should return a non empty message with an nonexistent id', async () => {
    const response = await request(app)
      .delete('/api/admin/62898d14882f8759987fz59')
      .send();
    expect(response.body.message).toEqual(
      'Cast to ObjectId failed for value "62898d14882f8759987fz59" (type string) at path "_id" for model "Admins"',
    );
  });

  test('Should return status code 204 with a correct id', async () => {
    const response = await request(app)
      .delete(`/api/admin/${adminValidId}`)
      .send();
    expect(response.status).toBe(204);
  });
});

const mockedAdmin2 = {
  id: '635437ebfc13ae2db70002b8',
  name: 'Tye',
  lastName: 'Haysar',
  email: 'thaysar0@miitbeian.gov.cn',
  password: 'E6HCIX',
};

describe('GET /admin', () => {
  test('should get all the admins', async () => {
    const response = await request(app).get('/api/admin').send();
    expect(response.body.data).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.body.message).not.toBeUndefined();
  });
  test('should not get all the admins with a wrong route', async () => {
    const response = await request(app).get(`/api/admins/?name=${mockedAdmin2.name}`).send();
    expect(response.status).toBe(404);
  });

  test('should find the admins filter by description', async () => {
    const response = await request(app).get(`/api/admin/?name=${mockedAdmin2.lastName}`).send();
    expect(response.status).toBe(200);
  });
  test('should find the admins filter by date', async () => {
    const response = await request(app).get(`/api/admin/?lastName=${mockedAdmin2.email}`).send();
    expect(response.status).toBe(200);
  });

  test('should find the admins filter by task', async () => {
    const response = await request(app).get(`/api/admin/?email=${mockedAdmin2}`).send();
    expect(response.status).toBe(200);
  });
});

describe('GET /admin/:id', () => {
  test('should find an employee by id', async () => {
    const response = await request(app).get(`/api/admin/${mockedAdmin2.id}`).send();
    expect(response.status).toBe(200);
    expect(response.body.message).not.toBeUndefined();
  });
  test('should return status code 400 with a wrong ID', async () => {
    const response = await request(app).get('/api/admins/6356efc2fc13ae56b9000014').send();
    expect(response.status).toBe(404);
    expect(response.body.data).toBeUndefined();
    expect(response.body.message).toBeUndefined();
  });
});
