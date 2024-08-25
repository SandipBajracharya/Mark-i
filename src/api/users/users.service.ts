import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaClient, Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesService } from '../roles/roles.service';
import { USER } from '@/common/constants/roles';
import { hashPassword } from '@/utils/password';
import { CustomError } from '@/common/custom/customError';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserAttrubute } from './dto/common.dto';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly roleService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let roleId: number = createUserDto?.role_id;

    // Default to user role
    if (!roleId) {
      const defaultRole = await this.roleService.findOneWithName(USER);
      roleId = defaultRole?.id;
    }

    // Check if email is already in use
    const existingUser = await this.findOneWithEmail(createUserDto.email);
    if (existingUser) {
      throw new CustomError('Email address is already in use', 400);
    }

    const existingUserWithNumber = await this.findOneWithNumber(
      createUserDto.phone,
      ['phone'],
    );
    if (existingUserWithNumber) {
      throw new CustomError('Phone is already in use', 400);
    }

    const formattedData = await this.formatBeforeStore(createUserDto);
    const user = prisma.user.create({
      data: { ...formattedData, role_id: roleId },
    });
    return user;
  }

  async findAll() {
    const usersForCache = await this.cacheManager.get('user_list');
    if (usersForCache) return usersForCache; // check in cache for data first and return if found
    const users = await prisma.user.findMany({
      where: { deleted_at: null },
      select: {
        email: true,
        email_verified_at: true,
        first_name: true,
        id: true,
        last_name: true,
        middle_name: true,
        phone: true,
        role_id: true,
      },
    });
    await this.cacheManager.set('user_list', users, 6000); // 6 seconds (in miliseconds)
    return users;
  }

  async findOne(
    id: number,
    minimal: string = null,
    where: Prisma.UserWhereUniqueInput = null,
  ) {
    let minimalSelect = {};
    if (minimal) {
      minimalSelect = {
        select: {
          id: true,
          first_name: true,
          middle_name: true,
          last_name: true,
          email: true,
          phone: true,
        },
      };
    }

    const user = await prisma.user.findUnique({
      where: { ...where, id },
      ...minimalSelect,
    });
    await this.cacheManager.set(`user_id_${id}`, user);
    return user;
  }

  async findOneWithEmail(
    email: string,
    attributes?: UserAttrubute[],
  ): Promise<any> {
    const select =
      attributes?.reduce((acc, attr) => {
        acc[attr] = true;
        return acc;
      }, {} as Prisma.UserSelect) || undefined;
    return await prisma.user.findUnique({
      where: { email },
      select,
    });
  }

  async findOneWithNumber(
    phone: string,
    attributes?: UserAttrubute[],
  ): Promise<any> {
    const select =
      attributes?.reduce((acc, attr) => {
        acc[attr] = true;
        return acc;
      }, {} as Prisma.UserSelect) || undefined;
    return await prisma.user.findUnique({
      where: { phone },
      select,
    });
  }

  async findFirst(
    where: Prisma.UserWhereUniqueInput | Prisma.UserWhereInput = null,
    attributes?: UserAttrubute[],
  ) {
    const select =
      attributes?.reduce((acc, attr) => {
        acc[attr] = true;
        return acc;
      }, {} as Prisma.UserSelect) || undefined;
    const user = await prisma.user.findFirst({
      where: { ...where },
      select,
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Check if email is already in use
    const existingUserWithEmail = await this.findFirst(
      {
        AND: [{ email: updateUserDto.email }, { id: { not: id } }],
      },
      ['email'],
    );
    if (existingUserWithEmail) {
      throw new CustomError('Email address is already in use', 400);
    }

    // check if phone is already in use
    const existingUserWithNumber = await this.findFirst(
      {
        AND: [{ phone: updateUserDto.phone }, { id: { not: id } }],
      },
      ['phone'],
    );
    if (existingUserWithNumber) {
      throw new CustomError('Phone is already in use', 400);
    }
    return await prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return await prisma.user.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(), // soft delete
      },
    });
  }

  private async formatBeforeStore(data: CreateUserDto) {
    const hashedPassword = await hashPassword(data.password);

    const formattedData = {
      ...data,
      password: hashedPassword,
    };
    return formattedData;
  }
}
