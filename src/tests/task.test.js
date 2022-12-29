import request from 'supertest';
import app from '../app';
import Task from '../models/Task';
import taskSeed from '../seeds/task';

beforeAll(async () => {
  await Task.collection.insertMany(taskSeed);
});

const taskValidId = '63544114fc13ae2db7000330';
let taskInvalidId = '6354389ffc13ae2db7004444';
const mockedTask = {
  description: 'FE',
};
const emptyMockedTask = {
  description: ' ',
};
const TaskWithId = {
  _id: '63544114fc13ae2db7000330',
  description: 'FE',
};

describe('getAll /tasks', () => {
  test('should get all tasks', async () => {
    const response = await request(app)
      .get('/api/tasks/')
      .send();
    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBe('Tasks found.');
  });
  test('should filter tasks by description', async () => {
    const response = await request(app)
      .get(`/api/tasks/?description=${TaskWithId.description}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data)
      .toEqual(expect.arrayContaining([expect.objectContaining(TaskWithId)]));
  });

  test('should get error 404 if the route is incorrect', async () => {
    const response = await request(app)
      .get('/api/task/')
      .send();
    expect(response.status).toBe(404);
    expect(response.status.error).toBeUndefined();
  });
});

describe('getById /tasks', () => {
  test('should get a task by ID', async () => {
    const response = await request(app)
    // eslint-disable-next-line no-underscore-dangle
      .get(`/api/tasks/${TaskWithId._id}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data).toEqual(TaskWithId);
  });
  test('should not find a task with the ID given thus return error 404', async () => {
    const response = await request(app)
      .get(`/api/tasks/${taskInvalidId}`)
      .send();
    expect(response.status).toBe(404);
    expect(response.body.error).toBeUndefined();
  });
});

describe('POST /tasks', () => {
  test('With an correct format the response should return a status 201', async () => {
    const response = await request(app)
      .post('/api/tasks/')
      .send(mockedTask);
    expect(response.status).toBe(201);
  });

  test('With an correct format the response should return a error false', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send(mockedTask);
    expect(response.body.error).toBeFalsy();
  });

  test('With an correct format the response should return a not undefined data', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send(mockedTask);
    expect(response.body.data).not.toBeUndefined();
  });

  test('With an correct format the response should return a correct message', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send(mockedTask);
    expect(response.body.message).toBe('New task successfully created.');
  });
});

describe('PUT /api/tasks/:id', () => {
  test('with valid ID should return status code 200', async () => {
    const response = await request(app)
      .put(`/api/tasks/${taskValidId}`)
      .send(mockedTask);
    expect(response.status).toBe(200);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBe(`${response.body.message}`);
  });

  test('whit ivalid ID should return status code 404', async () => {
    const response = await request(app)
      .put(`/api/tasks/${taskInvalidId}`)
      .send(mockedTask);
    expect(response.status).toBe(404);
    expect(response.body.data).toBeUndefined();
  });

  test('with empty ID should return status code 404', async () => {
    const response = await request(app)
      .put('/api/tasks/')
      .send(mockedTask);
    expect(response.status).toBe(404);
    expect(response.body.data).toBeUndefined();
    expect(response.body.message).toBe(undefined);
  });

  test('with an empty body should return status code 400', async () => {
    const response = await request(app)
      .put(`/api/tasks/${taskValidId}}`)
      .send(emptyMockedTask);
    expect(response.status).toBe(400);
    expect(response.body.data).toBeUndefined();
    expect(response.body.message).toBe(`${response.body.message}`);
  });
});

describe('DELETE /tasks/:id', () => {
  test('With an empty id the response should return a status 400', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${(taskInvalidId = null)}`)
      .send();
    expect(response.status).toBe(500);
  });

  test('With an incorrect route the response should return a status 404', async () => {
    const response = await request(app)
      .delete(`/api/tsks/${taskValidId}`)
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
      .delete('/api/tasks/62898d14882f8759987fz59')
      .send();
    expect(response.body.message).toBe(
      'Cast to ObjectId failed for value "62898d14882f8759987fz59" (type string) at path "_id" for model "Tasks"',
    );
  });

  test('With an correct id the response should return a status 204', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskValidId}`)
      .send();
    expect(response.status).toBe(204);
  });
});
