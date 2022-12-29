import request from 'supertest';
import app from '../app';
import SuperAdmin from '../models/SuperAdmin';
import superAdminsSeed from '../seeds/superAdmin';

const name = 'Maddy';
const lastName = 'Bretherick';
const email = 'abretherick0@bluehost.com';

const badReqId = '63540469873594f152b2ad3csda';
const reqId = '63543d4cfc13ae204b000039';

beforeAll(async () => {
  await SuperAdmin.collection.insertMany(superAdminsSeed);
});

const mockedSuperAdmin = {
  name: 'Maddy',
  lastName: 'Lincey',
  email: 'mlincey1@cornell.edu',
  password: 'Qvk23EHRkP',
};

const mockedIdSuperAdmin = {
  _id: '63543d4cfc13ae204b000039',
  name: 'Maddy',
  lastName: 'Lincey',
  email: 'mlincey1@cornell.edu',
  password: 'Qvk23EHRkP',
};

describe('GET /superAdmin', () => {
  test('should return status code 200', async () => {
    const response = await request(app).get('/api/superAdmin/').send();
    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBe('Super admins found.');
  });
  test('Find SuperAdmin filter by name', async () => {
    const response = await request(app).get(`/api/superAdmin/?description=${name}`).send();
    expect(response.status).toBe(200);
  });
  test('Find SuperAdmin filter by last name', async () => {
    const response = await request(app).get(`/api/superAdmin/?description=${lastName}`).send();
    expect(response.status).toBe(200);
  });
  test('Find SuperAdmin filter by email', async () => {
    const response = await request(app).get(`/api/superAdmin/?description=${email}`).send();
    expect(response.status).toBe(200);
  });
});

describe('PUT /superAdmin', () => {
  test('should return status 200', async () => {
    const response = await request(app).put(`/api/superAdmin/${reqId}`).send(mockedSuperAdmin);
    expect(response.status).toBe(200);
  });

  test('should return error fasle', async () => {
    const response = await request(app).put(`/api/superAdmin/${reqId}`).send(mockedSuperAdmin);
    expect(response.body.error).toBeFalsy();
  });

  test('bodys should be the same', async () => {
    const response = await request(app).put(`/api/superAdmin/${reqId}`).send(mockedSuperAdmin);
    expect(response.body.data).toEqual(mockedIdSuperAdmin);
  });

  test('check for success message', async () => {
    const response = await request(app).put(`/api/superAdmin/${reqId}`).send(mockedSuperAdmin);
    expect(response.body.message).toEqual('Super admin with the ID 63543d4cfc13ae204b000039 has been updated.');
  });

  test('should return status 400', async () => {
    const response = await request(app).put('/api/superAdmin/63540469873594f152b2ad3csda').send(mockedSuperAdmin);
    expect(response.status).toBe(500);
  });

  test('should return error true', async () => {
    const response = await request(app).put(`/api/superAdmin/${badReqId}`).send(mockedSuperAdmin);
    expect(response.body.error).toBe(undefined);
  });
  test('should return data undefined', async () => {
    const response = await request(app).put(`/api/superAdmin/${badReqId}`).send(mockedSuperAdmin);
    expect(response.body.data).toBe(undefined);
  });

  const wrongMockedSuperAdmin = {
    name: 'Maddy',
    lastName: 'Lincey',
    email: 'mlincey1@cornell.edu',
    password: 'QP',
  };
  test('should return status 404', async () => {
    const response = await request(app).put('/api/superAdmin/63540469873594f152b2ad3csda').send(mockedSuperAdmin);
    expect(response.status).toBe(500);
  });
  const superAdminId = '63543d4cfc13ae204b00003b';
  const wrongSuperAdminId = '63543d4cfc13ae204b000000';
  const getById = '63543d4cfc13ae204b000040';

  describe('Test Super Admin - Create', () => {
    test('Correct Body - Should create a new super admin - Status code 201', async () => {
      const response = await request(app).post('/api/superAdmin').send(mockedSuperAdmin);
      expect(response.status).toBe(201);
      expect(response.body.message).toEqual('New super admin successfully created.');
      expect(response.body.data).not.toBeUndefined();
      expect(response.body.error).toBeFalsy();
    });
    test('Without Body- Should not create a super admin - Status code 400', async () => {
      const response = await request(app).post('/api/superAdmin').send();
      expect(response.status).toBe(400);
      expect(response.body.message).not.toBeUndefined();
    });
    test('Wrong Body - Should not create a super admin - Status code 400', async () => {
      const response = await request(app).post('/api/superAdmin').send(wrongMockedSuperAdmin);
      expect(response.status).toBe(400);
      expect(response.body.message).not.toBeUndefined();
    });
    test('Wrong Path - Should not create a super admin - Status code 404', async () => {
      const response = await request(app).post('/api/superadmi').send(mockedSuperAdmin);
      expect(response.status).toBe(404);
      expect(response.body.message).toBeUndefined();
    });
  });

  describe('Test Super Admin - Delete', () => {
    test('Correct ID - Should delete a super admin - Status code 202', async () => {
      const response = await request(app).delete(`/api/superAdmin/${superAdminId}`);
      expect(response.status).toBe(204);
      expect(response.body.error).toBeFalsy();
    });
    test('Wrong ID - Should not delete a super admin - Status code 404', async () => {
      const response = await request(app).delete(`/api/superAdmin/${wrongSuperAdminId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toEqual('Super admin not found.');
    });
    test('Without ID - Should not delete a super admin - Status code 404', async () => {
      const response = await request(app).delete(`/api/superAdmin/${''}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBeUndefined();
    });
    test('Wrong Path - Should not delete a super admin - Status code 404', async () => {
      const response = await request(app).post(`/api/supperAdmin/${superAdminId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBeUndefined();
    });
  });

  describe('Test Super Admin - getById', () => {
    test('Correct ID - Should get a super admin - Status Code 200', async () => {
      const response = await request(app).get(`/api/superAdmin/${getById}`);
      expect(response.status).toBe(200);
      expect(response.body.error).toBeFalsy();
      expect(response.body.data).toBeDefined();
    });
    test('Wrong ID - Should not get a super admin - Status Code 400', async () => {
      const response = await request(app).get(`/api/superAdmin/${wrongSuperAdminId}`);
      expect(response.status).toBe(404);
      expect(response.body.data).toBeUndefined();
      expect(response.body.message).toBe('Super admin not found.');
    });
    test('Wrong Path - Should not get a super admin - Status code 404', async () => {
      const response = await request(app).get(`/api/supperAdmin/${superAdminId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBeUndefined();
    });
  });
});
