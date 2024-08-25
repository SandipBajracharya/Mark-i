import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
import { RolesService } from '@/api/roles/roles.service';
import { CreateRoleDto } from '@/api/roles/dto/create-role.dto';
import { AppModule } from '@/app.module';

const roleServiceMock = () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
});

const mockRole = {
  id: 1,
  name: 'testRole',
};

describe('RoleService', () => {
  let app: INestApplication;
  let service: any;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RolesService,
          useFactory: roleServiceMock,
        },
        AppModule,
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    jest.clearAllMocks();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await app.close();
  });

  it('findAll', async () => {
    service.findAll.mockResolvedValue('result');
    const result = await service.findAll();
    expect(result).toEqual('result');
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('create', async () => {
    const createRoleDto: CreateRoleDto = mockRole;
    const result = await service.create(createRoleDto);
    expect(service.create).toHaveBeenCalledTimes(1);
    expect(result).toBe(undefined);
  });

  describe('findOne', () => {
    it('role find success', async () => {
      service.findOne.mockResolvedValue(mockRole);
      const result = await service.findOne(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockRole);
    });
  });
});
