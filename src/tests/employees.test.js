import request from 'supertest';
import app from '../app';
import Employee from '../models/Employee';
import employeeSeed from '../seeds/employees';

beforeAll(async () => {
  await Employee.collection.insertMany(employeeSeed);
});

let employeeInvalidId = '6354389ffc13ae2db7004444';
const employeeValidId = '6354389ffc13ae2db7000326';

const mockedEmployee = {
  name: 'Isahella',
  lastName: 'Lanfer',
  phone: '9616259010',
  email: 'ilanfer0@joomla.org',
  password: 'IW8uR6SapD',
};

const employeeUser = {
  _id: '6354389ffc13ae2db7000326',
  name: 'Isahella',
  lastName: 'Lanfer',
  phone: '9616259010',
  email: 'ilanfer0@joomla.org',
  password: 'IW8uR6SapD',
};

const emptyMockedEmployee = {
  name: '',
  lastName: '',
  phone: '',
  email: '',
  password: '',
};

describe('getAll /employees', () => {
  test('should get all the employees', async () => {
    const response = await request(app)
      .get('/api/employees/')
      .send();
    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBe('Employees found.');
  });
  test('should filter the employees by name', async () => {
    const response = await request(app)
      .get(`/api/employees/?name=${employeeUser.name}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data)
      .toEqual(expect.arrayContaining([expect.objectContaining(employeeUser)]));
  });
  test('should filter the employees by lastName', async () => {
    const response = await request(app)
      .get(`/api/employees/?lastName=${employeeUser.lastName}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data)
      .toEqual(expect.arrayContaining([expect.objectContaining(employeeUser)]));
  });
  test('should filter the employees by email', async () => {
    const response = await request(app)
      .get(`/api/employees/?email=${employeeUser.email}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data)
      .toEqual(expect.arrayContaining([expect.objectContaining(employeeUser)]));
  });
  test('should filter the employees by phone', async () => {
    const response = await request(app)
      .get(`/api/employees/?phone=${employeeUser.phone}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data)
      .toEqual(expect.arrayContaining([expect.objectContaining(employeeUser)]));
  });

  test('should get error 404 if the route is incorrect', async () => {
    const response = await request(app)
      .get('/api/employee')
      .send();
    expect(response.status).toBe(404);
    expect(response.status.error).toBeUndefined();
  });
});

describe('getById /employees', () => {
  test('should get an employee by ID', async () => {
    const response = await request(app)
    // eslint-disable-next-line no-underscore-dangle
      .get(`/api/employees/${employeeUser._id}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data).toEqual(employeeUser);
  });
  test('should not find an employee with the ID given thus return error 404', async () => {
    const response = await request(app)
      .get(`/api/employees/${employeeInvalidId}`)
      .send();
    expect(response.status).toBe(404);
    expect(response.body.error).toBeUndefined();
  });
});

describe('POST /employees', () => {
  test('With an correct user the response should return a status 201', async () => {
    const response = await request(app)
      .post('/api/employees')
      .send(mockedEmployee);
    expect(response.status).toBe(201);
  });
  test('With an correct user the response should return a error false', async () => {
    const response = await request(app)
      .post('/api/employees')
      .send(mockedEmployee);
    expect(response.body.error).toBeFalsy();
  });
  test('With an correct user the response should return a not undefined data', async () => {
    const response = await request(app)
      .post('/api/employees')
      .send(mockedEmployee);
    expect(response.body.data).not.toBeUndefined();
  });
  test('With an correct user the response should return a correct message', async () => {
    const response = await request(app)
      .post('/api/employees')
      .send(mockedEmployee);
    expect(response.body.message).toEqual('New employee successfully created.');
  });
  test('name length min 3', async () => {
    const response = await request(app)
      .post('/api/employees')
      .send(mockedEmployee);
    expect(response.body.data.name.length).toBeGreaterThan(3);
  });
});

describe('PUT /api/employees/:id', () => {
  test('with valid ID should return status code 200', async () => {
    const response = await request(app)
      .put(`/api/employees/${employeeValidId}`)
      .send(mockedEmployee);
    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBe(`${response.body.message}`);
  });
  test('whit ivalid ID should return status code 400', async () => {
    const response = await request(app)
      .put('/api/employees/adsd')
      .send(mockedEmployee);
    expect(response.status).toBe(400);
    expect(response.body.data).toBeUndefined();
  });
  test('with empty ID should return status code 404', async () => {
    const response = await request(app)
      .put('/api/employees/')
      .send(mockedEmployee);
    expect(response.status).toBe(404);
    expect(response.body.data).toBeUndefined();
    expect(response.body.message).toBe(undefined);
  });
  test('with an empty body should return status code 400', async () => {
    const response = await request(app)
      .put(`/api/employees/${employeeValidId}`)
      .send(emptyMockedEmployee);
    expect(response.status).toBe(400);
    expect(response.body.data).toBeUndefined();
    expect(response.body.message).toBe(`${response.body.message}`);
  });
});

describe('DELETE /employees/:id', () => {
  test('With an empty id the response should return a status 400', async () => {
    const response = await request(app)
      .delete(`/api/employees/${(employeeInvalidId = null)}`)
      .send();
    expect(response.status).toBe(500);
  });
  test('With an incorrect route the response should return a status 404', async () => {
    const response = await request(app)
      .delete(`/api/empls/${employeeInvalidId}`)
      .send();
    expect(response.status).toBe(404);
  });
  test('With an empty id the response should return a status 404', async () => {
    const response = await request(app)
      .delete('/api/employees/')
      .send({});
    expect(response.status).toBe(404);
  });
  test('With an nonexistent id the response should return a data undefined', async () => {
    const response = await request(app)
      .delete('/api/employees/62898d14882f8759987fz59')
      .send();
    expect(response.body.data).toBeUndefined();
  });
  test('With an nonexistent id the response should return a non empty message', async () => {
    const response = await request(app)
      .delete('/api/employees/62898d14882f8759987fz59')
      .send();
    expect(response.body.message).toBe(
      'Cast to ObjectId failed for value "62898d14882f8759987fz59" (type string) at path "_id" for model "Employees"',
    );
  });
  test('With an correct id the response should return a status 204', async () => {
    const response = await request(app)
      .delete(`/api/employees/${employeeValidId}`)
      .send();
    expect(response.status).toBe(204);
  });
});
