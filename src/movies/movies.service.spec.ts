import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // movie 목록을 가져올 때, 해당 목록의 타입이 배열인지 테스트
  describe('getAll', () => {
    it('should return an array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  // movie 하나를 가져올 때,
  describe('getOne', () => {
    it('sholud return a movie', () => {
      // test 를 위한 mock data 생성
      service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 1991,
      });

      const movie = service.getOne(1);
      expect(movie).toBeDefined();
    });

    // error case
    it('should throw a 404 error', () => {
      try {
        service.getOne(9999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
