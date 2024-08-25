import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { CreateRoleDto } from '@/api/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@/api/roles/dto/update-role.dto';

describe('RolesController (unit)', () => {
  let app: INestApplication;
  let token: string, tokenType: string;
  let createRoleId: number;

  function generateRandomString(length: number) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // register
  // it('should register and return success', async () => {
  //   const payload = {
  //     first_name: 'Nhuja',
  //     middle_name: '',
  //     last_name: 'sth',
  //     email: 'sndp106.sb@gmail.com',
  //     password: 'sandeep',
  //   };
  //   await request(app.getHttpServer())
  //     .post('/authentication/register')
  //     .send(payload)
  //     .expect(201);
  // });

  // login
  it('should login and return success with bearer token', async () => {
    const creds = {
      email: 'sndp106.sb@gmail.com',
      password: 'sandeep',
    };
    const response = await request(app.getHttpServer())
      .post('/authentication/login')
      .send(creds)
      .expect(201);

    token = response.body.data.token;
    tokenType = response.body.data.tokenType;
  });

  // get all roles
  it('GET /api/roles should return roles list with status 200', (done) => {
    request(app.getHttpServer())
      .get('/api/roles')
      .set('Authorization', `${tokenType} ${token}`)
      .expect(200)
      .end((error, response) => {
        expect(response.body.data).not.toEqual(null);
        expect(typeof response.body.data).toBe('object');
        expect(response.body.data.length).toBeGreaterThan(0);
        if (error) {
          throw error;
        }
        done();
      });
  });

  // create
  it('POST /api/roles should create role with status 201', (done) => {
    const payload: CreateRoleDto = {
      name: generateRandomString(5), // random string as role name as unique index in DB
    };
    request(app.getHttpServer())
      .post('/api/roles')
      .set('Authorization', `${tokenType} ${token}`)
      .send(payload)
      .end(function (err, res) {
        expect(res.statusCode).toBe(201);
        expect(res.body.data).not.toEqual(null);
        expect(res.body.data.id).not.toEqual(null);
        expect(res.body.data.name).toBe(payload.name);
        createRoleId = res.body.data.id;

        if (err) {
          throw err;
        }
        done();
      });
  });

  // get one role
  it('GET /api/roles/:id should return role by id with status 200', (done) => {
    request(app.getHttpServer())
      .get(`/api/roles/${createRoleId}`)
      .set('Authorization', `${tokenType} ${token}`)
      // .expect(200)
      .end(function (err, res) {
        expect(res.statusCode).toBe(200);
        expect(res.body.data).not.toEqual(null);
        expect(res.body.data.id).not.toEqual(null);
        expect(typeof res.body.data.name).toBe('string');
        if (err) {
          throw err;
        }
        done(); // indicates test is done. No need to return request when using done()
      });
  });

  // Update
  it('PATCH /api/roles/:id should update role with status 200', (done) => {
    const updatePayload: UpdateRoleDto = {
      name: generateRandomString(5), // random string as role name as unique index in DB
    };
    request(app.getHttpServer())
      .patch(`/api/roles/${createRoleId}`)
      .set('Authorization', `${tokenType} ${token}`)
      .send(updatePayload)
      .end(function (err, res) {
        expect(res.statusCode).toBe(200);
        expect(res.body.data).not.toEqual(null);
        expect(res.body.data.id).not.toEqual(null);
        expect(res.body.data.name).toBe(updatePayload.name);
        if (err) {
          throw err;
        }
        done();
      });
  });

  it('DELETE /api/roles/:id should delete role with status 200', () => {
    return request(app.getHttpServer())
      .delete(`/api/roles/${createRoleId}`)
      .set('Authorization', `${tokenType} ${token}`)
      .expect(200);
  });
});
