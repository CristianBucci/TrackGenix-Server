import request from 'supertest';
import app from '../app';
import Projects from '../models/Projects';
import projectsSeed from '../seeds/projects';

const idProject = '635015885581eb421df09402';
const idInvalid = '635015885581eb421df09404';
const name = 'Nan';

beforeAll(async () => {
  await Projects.collection.insertMany(projectsSeed);
});

const mockedProject = {
  name: 'nulla suscipit',
  description: 'tincidunt ante',
  startDate: '01/07/2022',
  endDate: '12/29/2022',
  clientName: 'Abbey',
  employees: [{
    employeeId: '63544791fc13ae64f60000b5',
    role: 'DEV',
    rate: 300,
  }],
};

const wrongMockedProject = {
  name: 'nulla suscipit',
  description: 'tincidunt ante',
  startDate: '01/07/2022',
  endDate: '01/29/2022',
  clientName: 'Abbey',
  employees: [{
    employeeId: '63544791fc13ae64f60000b5',
    role: 'DEV',
    rate: 300,
  }],
};

const editProjectId = '6350160d76dd03ff29e75dd3';

describe('Test Project - Create', () => {
  test('Correct Body - Should create a new project - Status code 201', async () => {
    const response = await request(app).post('/api/projects').send(mockedProject);
    expect(response.status).toBe(201);
    expect(response.body.message).toEqual('New project successfully created.');
    expect(response.body.data).not.toBeUndefined();
    expect(response.body.error).toBeFalsy();
  });
  test('Without Body- Should not create a project - Status code 400', async () => {
    const response = await request(app).post('/api/projects').send();
    expect(response.status).toBe(400);
    expect(response.body.message).not.toBeUndefined();
  });
  test('Wrong Body - Should not create a project - Status code 400', async () => {
    const response = await request(app).post('/api/projects').send(wrongMockedProject);
    expect(response.status).toBe(400);
    expect(response.body.message).not.toBeUndefined();
  });
  test('Wrong Path - Should not create a project - Status code 400', async () => {
    const response = await request(app).post('/api/projec').send(mockedProject);
    expect(response.status).toBe(404);
    expect(response.body.message).toBeUndefined();
  });
});

describe('Test Project - Delete', () => {
  test('Correct ID - Should delete a project - Status code 204', async () => {
    const response = await request(app).delete(`/api/projects/${idProject}`);
    expect(response.status).toBe(204);
    expect(response.body.error).toBeFalsy();
  });
  test('Wrong ID - Should not delete a project - Status code 404', async () => {
    const response = await request(app).delete(`/api/projects/${idInvalid}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Project not found.');
  });
  test('Without ID - Should not delete a project - Status code 404', async () => {
    const response = await request(app).delete(`/api/projects/${''}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBeUndefined();
  });
  test('Wrong Path - Should not delete a project - Status code 404', async () => {
    const response = await request(app).post('/api/projec').send(idProject);
    expect(response.status).toBe(404);
    expect(response.body.message).toBeUndefined();
  });
});

describe('Test Project - Edit', () => {
  test('Correct ID and correct body - Should let you edit a project - Status code 200', async () => {
    const response = await request(app).put(`/api/projects/${editProjectId}`).send(mockedProject);
    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data).not.toBeUndefined();
    expect(response.body.message).toEqual(`Project with the ID ${editProjectId} has been updated.`);
  });
  test('Correct ID and wrong body - Should not let you edit a project - Status code 400', async () => {
    const response = await request(app).put(`/api/projects/${editProjectId}`).send(wrongMockedProject);
    expect(response.status).toBe(400);
    expect(response.body.message).not.toBeUndefined();
  });
  test('Wrong ID and correct body - Should not let you edit a project - Status code 404', async () => {
    const response = await request(app).put(`/api/projects/${idInvalid}`).send(mockedProject);
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Project not found.');
  });
  test('Wrong ID and wrong body - Should not let you edit a project - Status code 400', async () => {
    const response = await request(app).put(`/api/projects/${idInvalid}`).send(wrongMockedProject);
    expect(response.status).toBe(400);
    expect(response.body.message).not.toBeUndefined();
  });
  test('Wrong path - Should not let you edit a project - Status code 404', async () => {
    const response = await request(app).put(`/api/projec/${idInvalid}`).send(wrongMockedProject);
    expect(response.status).toBe(404);
    expect(response.body.message).toBeUndefined();
  });
  test('Without body - Should not let you edit a project - Status code 400', async () => {
    const response = await request(app).put(`/api/projects/${editProjectId}`).send();
    expect(response.status).toBe(400);
    expect(response.body.message).not.toBeUndefined();
  });
  test('Without ID - Should not let you edit a project - Status code 404', async () => {
    const response = await request(app).put(`/api/projects/${''}`).send(mockedProject);
    expect(response.status).toBe(404);
    expect(response.body.message).toBeUndefined();
  });
});

describe('Projects - Unit test', () => {
  describe('GET /projects', () => {
    test('should return status code 200', async () => {
      const response = await request(app).get('/api/projects/').send();
      expect(response.status).toBe(200);
      expect(response.body.error).toBeFalsy();
      expect(response.body.data).toBeDefined();
      expect(response.body.message).toBe('Projects found.');
    });
  });

  describe('GET BY ID /:id', () => {
    test('should return status code 200', async () => {
      const response = await request(app).get(`/api/projects/${editProjectId}`).send();
      expect(response.status).toBe(200);
      expect(response.body.error).toBeFalsy();
      expect(response.body.data).toBeDefined();
    });
    test('Find project filter by name', async () => {
      const response = await request(app).get(`/api/projects/?description=${name}`).send();
      expect(response.status).toBe(200);
    });
  });

  describe('GET BY ID ERROR /:id', () => {
    test('should return status code 400', async () => {
      const response = await request(app).get(`/api/projects/${idInvalid}`).send();
      expect(response.status).toBe(404);
      expect(response.body.data).toBeUndefined();
      expect(response.body.message).toBe(`${response.body.message}`);
    });
  });
});
