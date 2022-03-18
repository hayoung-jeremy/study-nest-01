import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  // beforeEach 는 매 테스트 마다 APP 을 생성하기 때문에, 테스트마다 데이터베이스가 비워져있음, 그래서 beforeAll 로 변경해야함
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    // 테스트 환경을 실제 APP 환경과 동일하게 설정해야함,
    // pipe 설정이 없기 때문에 id transformation 이 일어나지 않고,
    // id 로 movie 를 가져오는 테스트를 진행하면 에러를 반환함
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });
  // sending API request
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Welcome to the Movie API');
  });

  describe('/moives', () => {
    // 테스트에 필요한 database 와 평소 사용하는 database 따로 있음
    // 테스팅 database 에서는 데이터를 생성, 삭제하는 일이 빈번함
    // 처음부터 빈 database 이기 때문에 아래와 같이 테스트함
    it('GET', () => {
      return request(app.getHttpServer()).get('/movies').expect(200).expect([]);
    });

    it('POST 201', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({ title: 'TEST', year: 1991, genres: ['TEST'] })
        .expect(201);
    });
    it('POST 400', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'TEST',
          year: 1991,
          genres: ['TEST'],
          fakeOption: false,
        })
        .expect(400);
    });
    it('DELETE', () => {
      return request(app.getHttpServer()).delete('/movies').expect(404);
    });
  });

  describe('/movies/:id', () => {
    it('GET 200', () => {
      return request(app.getHttpServer()).get('/movies/1').expect(200);
    });
    it('GET 404', () => {
      return request(app.getHttpServer()).get('/movies/9999').expect(404);
    });
    it('PATCH 200', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({ title: 'Updating test' })
        .expect(200);
    });
    it('DELETE 200', () => {
      return request(app.getHttpServer()).delete('/movies/1').expect(200);
    });
  });
});
