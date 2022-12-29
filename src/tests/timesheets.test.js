import request from 'supertest';
import assert from 'assert';
import { Types } from 'mongoose';
import app from '../app';
import Timesheet from '../models/TimeSheet';
import timesheetSeeds from '../seeds/timesheets';
import Task from '../models/Task';
import taskSeeds from '../seeds/task';
import Project from '../models/Projects';
import projectSeeds from '../seeds/projects';
import Employee from '../models/Employee';
import employeeSeeds from '../seeds/employees';

const { ObjectId } = Types;
/* eslint no-underscore-dangle: 0 */
let insertedTimesheets = [];

const seedDB = async () => {
  const objectIdMaptoArray = (map, size) => {
    const array = [];
    for (let i = 0; i < size; i += 1) {
      array.push(map[i].toString());
    }
    return array;
  };
  await new Promise((resolve, reject) => {
    const done = {
      employees: false,
      tasks: false,
      projects: false,
      timesheets: false,
    };
    const finishSeeding = () => {
      if (done.employees
        && done.tasks
        && done.projects
        && done.timesheets) resolve(true);
    };
    Employee.insertMany(employeeSeeds, { rawResult: true }, (error, response) => {
      done.employees = !error;
      if (!error && employeeSeeds.length === response.insertedCount) {
        finishSeeding();
      } else reject(error);
    });
    Task.insertMany(taskSeeds, { rawResult: true }, (error, response) => {
      done.tasks = !error;
      if (!error && taskSeeds.length === response.insertedCount) {
        finishSeeding();
      } else reject(error);
    });
    Project.insertMany(projectSeeds, { rawResult: true }, (error, response) => {
      done.projects = !error;
      if (!error && projectSeeds.length === response.insertedCount) {
        finishSeeding();
      } else reject(error);
    });
    const trimmedTimesheets = timesheetSeeds.slice(0, -7);
    Timesheet.insertMany(trimmedTimesheets, { rawResult: true }, (error, response) => {
      done.timesheets = !error;
      if (!error && trimmedTimesheets.length === response.insertedCount) {
        insertedTimesheets = objectIdMaptoArray(response.insertedIds, response.insertedCount);
        finishSeeding();
      } else reject(error);
    });
  });
};

const clearDB = async () => {
  Employee.collection.drop();
  Task.collection.drop();
  Project.collection.drop();
  Timesheet.collection.drop();
  insertedTimesheets = [];
};

beforeEach(async () => {
  await seedDB();
});

afterEach(async () => {
  await clearDB();
});

describe('[POST] /api/timesheets/ endpoint => CREATE a timesheet.', () => {
  const timesheetTestItems = timesheetSeeds.slice(-7);

  test('sending ALL required data fields (nominal)', async () => {
    let countBefore;
    let response = await request(app).get('/api/timesheets');
    if (response.ok) {
      countBefore = response.body.data.length;
    // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
    const payload = timesheetTestItems[0];
    delete payload._id;
    response = await request(app).post('/api/timesheets/').type('json')
      .send(JSON.stringify(payload));
    expect(response.status).toBe(201);
    expect(response.body.message).toMatch(/created/);
    expect(response.body.data).toBeTruthy();
    expect(response.body.error).toBeFalsy();
    response = await request(app).get('/api/timesheets/');
    if (response.ok) {
      expect(countBefore < response.body.data.length).toBeTruthy();
      // eslint-disable-next-line no-throw-literal
    } else throw '[GET] 3/api/timesheets failed response';
  });

  test('sending only SOME data fields (not allowed) ', async () => {
    let countBefore;
    let response = await request(app).get('/api/timesheets');
    if (response.ok) {
      countBefore = response.body.data.length;
      // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
    const payload = timesheetTestItems[1];
    delete payload._id;
    delete payload.description;
    response = await request(app).post('/api/timesheets/').type('json')
      .send(JSON.stringify(payload));
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/error/);
    expect(response.body.error).toBeTruthy();
    response = await request(app).get('/api/timesheets/');
    if (response.ok) {
      expect(countBefore === response.body.data.length).toBeTruthy();
      // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
  });

  test('with ALL fields and an UNEXPECTED ID path param (not nominal, handled)', async () => {
    let countBefore;
    let response = await request(app).get('/api/timesheets');
    if (response.ok) {
      countBefore = response.body.data.length;
    // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
    const payload = timesheetTestItems[2];
    const unnecessaryId = payload._id;
    delete payload._id;
    response = await request(app).post(`/api/timesheets/${unnecessaryId}`)
      .send(payload);
    expect(response.status).toBe(201);
    expect(response.body.message).toMatch(/created/);
    expect(response.body.data).toBeTruthy();
    expect(response.body.error).toBeFalsy();
    response = await request(app).get('/api/timesheets/');
    if (response.ok) {
      expect(countBefore < response.body.data.length).toBeTruthy();
    // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
  });

  test('with ALL fields and an UNEXPECTED ID PROPERTY in request body (not allowed)', async () => {
    let countBefore;
    let response = await request(app).get('/api/timesheets');
    if (response.ok) {
      countBefore = response.body.data.length;
      // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
    const payload = timesheetTestItems[3];
    response = await request(app).post('/api/timesheets/')
      .send(JSON.stringify(payload));
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/error/);
    expect(response.body.error).toBeTruthy();
    response = await request(app).get('/api/timesheets/');
    if (response.ok) {
      expect(countBefore === response.body.data.length).toBeTruthy();
      // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
  });

  test('with ALL fields and UNEXPECTED and relevant query params (no effect)', async () => {
    let countBefore;
    let response = await request(app).get('/api/timesheets');
    if (response.ok) {
      countBefore = response.body.data.length;
      // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
    const payload = timesheetTestItems[4];
    delete payload._id;
    const queryParam = { hours: payload.hours };
    response = await request(app).post('/api/timesheets/')
      .query(queryParam)
      .type('json')
      .send(payload);
    expect(response.status).toBe(201);
    expect(response.body.message).toMatch(/created/);
    expect(response.body.data).toBeTruthy();
    expect(response.body.error).toBeFalsy();
    response = await request(app).get('/api/timesheets/');
    if (response.ok) {
      expect(countBefore < response.body.data.length).toBeTruthy();
      // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
  });

  test('<hours> OUT OF RANGE (not allowed)', async () => {
    let countBefore;
    let response = await request(app).get('/api/timesheets');
    if (response.ok) {
      countBefore = response.body.data.length;
      // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
    const payload = timesheetTestItems[5];
    delete payload._id;
    payload.hours = 13;
    response = await request(app).post('/api/timesheets/')
      .send(JSON.stringify(payload));
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/error/);
    expect(response.body.error).toBeTruthy();
    response = await request(app).get('/api/timesheets/');
    if (response.ok) {
      expect(countBefore === response.body.data.length).toBeTruthy();
      // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
  });

  test('<date> is PAST TODAY (not allowed)', async () => {
    let countBefore;
    let response = await request(app).get('/api/timesheets');
    if (response.ok) {
      countBefore = response.body.data.length;
      // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
    const payload = timesheetTestItems[6];
    delete payload._id;
    const today = new Date();
    const newDate = new Date();
    newDate.setFullYear(today.getFullYear() + 1);
    const dateStr = `${newDate.getMonth()}/${newDate.getDay()}/${newDate.getFullYear()}`;
    payload.date = dateStr;
    response = await request(app).post('/api/timesheets/')
      .send(payload);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/error/);
    expect(response.body.error).toBeTruthy();
    response = await request(app).get('/api/timesheets/');
    if (response.ok) {
      expect(countBefore === response.body.data.length).toBeTruthy();
      // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
  });
});

describe('[PUT] /api/timesheets/:id endpoint => UPDATE/EDIT a timesheet.', () => {
  const isValidId = (id) => {
    try {
      const oid = new ObjectId(id);
      return ObjectId.isValid(id)
          && oid.toString() === id;
    } catch {
      return false;
    }
  };

  test('with a VALID EXISTENT ID and ALL VALID DATA FIELDS sent in the body (NOMINAL)', async () => {
    const index = 0;
    const id = insertedTimesheets[index];
    let response = await request(app).get(`/api/timesheets/${id}`).query({ disablePopulate: true });
    let oldDocument;
    if (response.ok) {
      oldDocument = response.body.data;
    // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
    const payload = {
      description: oldDocument.description,
      date: oldDocument.date,
      task: oldDocument.task,
      employee: oldDocument.employee,
      project: oldDocument.project,
      hours: oldDocument.hours,
    };
    payload.description = '-altered data-';
    oldDocument.description = '-altered data-';
    payload.hours = 5;
    oldDocument.hours = 5;
    response = await request(app).put(`/api/timesheets/${id}`)
      .send(payload);
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/updated/);
    expect(response.body.error).toBeFalsy();
    response = await request(app).get(`/api/timesheets/${id}`).query({ disablePopulate: true });
    if (response.ok) {
      expect(oldDocument).toMatchObject(payload);
      // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
  });

  test('with a VALID EXISTENT ID and SOME VALID DATA FIELDS sent in the body (NOMINAL)', async () => {
    const index = 1;
    const id = insertedTimesheets[index];
    let response = await request(app).get(`/api/timesheets/${id}`).query({ disablePopulate: true });
    let oldDocument;
    if (response.ok) {
      oldDocument = response.body.data;
    // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
    const payload = {};
    delete oldDocument._id;
    delete oldDocument.__v;
    delete oldDocument.createdAt;
    delete oldDocument.updatedAt;
    payload.description = '-more altered data-';
    oldDocument.description = payload.description;
    payload.hours = 1;
    oldDocument.hours = payload.hours;
    response = await request(app).put(`/api/timesheets/${id}`)
      .send(payload);
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/updated/);
    expect(response.body.error).toBeFalsy();
    response = await request(app).get(`/api/timesheets/${id}`).query({ disablePopulate: true });
    if (response.ok) {
      expect(response.body.data).toMatchObject(oldDocument);
    // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
  });

  test('with a VALID EXISTENT ID and SOME INVALID DATA FIELDS sent in the body (NOT NOMINAL)', async () => {
    const index = 2;
    const id = insertedTimesheets[index];
    let response = await request(app).get(`/api/timesheets/${id}`).query({ disablePopulate: true });
    let oldDocument;
    if (response.ok) {
      oldDocument = response.body.data;
    // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
    const payload = {};
    delete oldDocument._id;
    delete oldDocument.__v;
    delete oldDocument.createdAt;
    delete oldDocument.updatedAt;
    payload.description = '-more altered data-';
    payload.hours = 1;
    payload.irrelevant = 'dummy text';
    payload.unrelated = -54;
    response = await request(app).put(`/api/timesheets/${id}`)
      .send(payload);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/error/);
    expect(response.body.error).toBeTruthy();
    response = await request(app).get(`/api/timesheets/${id}`).query({ disablePopulate: true });
    if (response.ok) {
      expect(response.body.data).toMatchObject(oldDocument);
    // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
  });

  test('with an VALID NON-EXISTENT ID and SOME DATA FIELDS sent in the body (FAILS)', async () => {
    const id = '63544114fc13ae2db7000335';
    let response = await request(app).get(`/api/timesheets/${id}`);
    // eslint-disable-next-line no-throw-literal
    if (response.ok) throw 'Non-existant ID actually exists';
    const payload = {};
    payload.date = '01/01/2022';
    payload.employee = '6354389ffc13ae2db7000329';
    response = await request(app).put(`/api/timesheets/${id}`)
      .send(payload);
    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/not found/);
    expect(response.body.error).toBeTruthy();
  });

  test('with an INVALID ID and SOME DATA FIELDS sent in the body (FAILS)', async () => {
    const id = 'clearlyNotAnId';
    assert(!isValidId(id));
    const payload = {};
    payload.date = '01/01/2022';
    payload.employee = '6354389ffc13ae2db7000329';
    const response = await request(app).put(`/api/timesheets/${id}`)
      .send(payload);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/id/);
    expect(response.body.error).toBeTruthy();
  });

  test('WITHOUT an ID and ALL DATA FIELDS sent in the body (FAILS)', async () => {
    const payload = {};
    payload.date = '01/01/2022';
    payload.employee = '6354389ffc13ae2db7000329';
    const response = await request(app).put('/api/timesheets/')
      .send(payload);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
    expect(response.body.message).toMatch(/id/);
    expect(response.body.error).toBeTruthy();
  });

  test('with a VALID EXISTENT ID and <date> PAST TODAY sent in the body (NOT ALLOWED)', async () => {
    const index = 2;
    const id = insertedTimesheets[index];
    let response = await request(app).get(`/api/timesheets/${id}`).query({ disablePopulate: true });
    let oldDocument;
    if (response.ok) {
      oldDocument = response.body.data;
    // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
    const payload = {};
    delete oldDocument._id;
    delete oldDocument.__v;
    delete oldDocument.createdAt;
    delete oldDocument.updatedAt;
    payload.description = '-changed info-';
    payload.hours = 2;
    const today = new Date();
    const newDate = new Date();
    newDate.setFullYear(today.getFullYear() + 1);
    const dateStr = `${newDate.getMonth()}/${newDate.getDay()}/${newDate.getFullYear()}`;
    payload.date = dateStr;
    response = await request(app).put(`/api/timesheets/${id}`)
      .send(payload);
    expect(response.status).toBe(400);
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeTruthy();
    response = await request(app).get(`/api/timesheets/${id}`).query({ disablePopulate: true });
    if (response.ok) {
      expect(response.body.data).toMatchObject(oldDocument);
    // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
  });
  test('with a VALID EXISTENT ID and <hours> more than 12 (NOT ALLOWED)', async () => {
    const index = 2;
    const id = insertedTimesheets[index];
    let response = await request(app).get(`/api/timesheets/${id}`).query({ disablePopulate: true });
    let oldDocument;
    if (response.ok) {
      oldDocument = response.body.data;
    // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
    const payload = {};
    delete oldDocument._id;
    delete oldDocument.__v;
    delete oldDocument.createdAt;
    delete oldDocument.updatedAt;
    payload.description = '-changed info-';
    payload.hours = 22;
    response = await request(app).put(`/api/timesheets/${id}`)
      .send(payload);
    expect(response.status).toBe(400);
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeTruthy();
    response = await request(app).get(`/api/timesheets/${id}`).query({ disablePopulate: true });
    if (response.ok) {
      expect(response.body.data).toMatchObject(oldDocument);
    // eslint-disable-next-line no-throw-literal
    } else throw '[GET] /api/timesheets failed response';
  });
});

// import Timesheet from '../models/TimeSheet';
// import timesheetSeeds from '../seeds/timesheets';

// beforeAll(async () => {
//   await Timesheet.collection.insertMany(timesheetSeeds);
// });

const timesheetId = '6354438cfc13ae204b000063';
const timesheetDesc = 'orci mauris';
const timesheetDate = '2/3/2022';
const timesheetTask = '63544114fc13ae2db7000337';
const timesheetEmployee = '6354389ffc13ae2db700032f';
const timesheetProject = '635446a1fc13ae04ac000214';
const timesheetHours = 2;

describe('DELETE /timesheet/:id', () => {
  test('should delete an employee', async () => {
    const response = await request(app).delete(`/api/timesheets/${timesheetId}`).send();
    expect(response.status).toBe(204);
    expect(response.body.message).toBeUndefined();
  });
  test("if I don't pass the id the response should be a status 404", async () => {
    const response = await request(app).delete('/api/timesheets/').send();
    expect(response.status).toBe(404);
    expect(response.body.message).toBeUndefined();
  });
  test('response status should be 404 with a wrong route ', async () => {
    const response = await request(app).delete(`/api/timesheet/${timesheetId}`).send();
    expect(response.status).toBe(404);
    expect(response.body.message).toBeUndefined();
  });
  test('response status should be 404 with a wrong id', async () => {
    const response = await request(app).delete('/api/timesheets/6356efc2fc13ae56b9000014').send();
    expect(response.status).toBe(404);
    expect(response.body.message).not.toBeUndefined();
  });
});
describe('GET /timesheet', () => {
  test('should find all the timesheets', async () => {
    const response = await request(app).get('/api/timesheets').send();
    expect(response.status).toBe(200);
  });
  test('should not find all the timesheets with a wrong route', async () => {
    const response = await request(app).get('/api/timesheet').send();
    expect(response.status).toBe(404);
  });

  test('should find the timesheets filter by description', async () => {
    const response = await request(app).get(`/api/timesheets/?description=${timesheetDesc}`).send();
    expect(response.status).toBe(200);
  });
  test('should find the timesheets filter by date', async () => {
    const response = await request(app).get(`/api/timesheets/?date=${timesheetDate}`).send();
    expect(response.status).toBe(200);
  });

  test('should find the timesheets filter by task', async () => {
    const response = await request(app).get(`/api/timesheets/?task=${timesheetTask}`).send();
    expect(response.status).toBe(200);
  });
  test('should find the timesheets filter by employee', async () => {
    const response = await request(app).get(`/api/timesheets/?employee=${timesheetEmployee}`).send();
    expect(response.status).toBe(200);
  });
  test('should find the timesheets filter by project', async () => {
    const response = await request(app).get(`/api/timesheets/?project=${timesheetProject}`).send();
    expect(response.status).toBe(200);
  });
  test('should find the timesheets filter by hours', async () => {
    const response = await request(app).get(`/api/timesheets/?hours=${timesheetHours}`).send();
    expect(response.status).toBe(200);
  });
});
describe('GET /timesheet/:id', () => {
  // PROBLEM: see that some properties like '_id' and 'description'
  // were somehow omitted, presumably at import time. Coincidentally,
  // test1 from 'create' suite fails with status 404, which would imply
  // id is not valid, non-existent, or undefined.

  // test('should find an employee by id', async () => {
  //   // check and compare this two outputs and the seed file.
  //   // Spooky behaviour
  //   const data = await Timesheet.find({});
  //   // this user id is in the seeds file but not found in the db/import
  //   const response = await request(app).get('/api/timesheets/6354438cfc13ae204b000069').send();
  //   expect(response.status).toBe(200);
  // });

  test('should return status code 400', async () => {
    const response = await request(app).get('/api/timesheets/6356efc2fc13ae56b9000014').send();
    expect(response.status).toBe(404);
    expect(response.body.data).toBeUndefined();
    expect(response.body.message).not.toBeUndefined();
  });
});
