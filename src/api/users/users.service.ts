import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaClient } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesService } from '../roles/roles.service';
import { USER } from 'src/common/constants/roles';
import { hashPassword } from 'src/utils/password';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  constructor(private readonly roleService: RolesService) {}

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
      throw new Error('Email address is already in use');
    }

    const formattedData = await this.formatBeforeStore(createUserDto);
    const user = prisma.user.create({
      data: { ...formattedData, role_id: roleId },
    });
    return user;
  }

  async findAll() {
    return await prisma.user.findMany();
  }

  async findOne(id: number) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findOneWithEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
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
