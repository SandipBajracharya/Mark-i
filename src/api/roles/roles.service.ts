import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class RolesService {
  async create(createRoleDto: CreateRoleDto) {
    return await prisma.role.create({
      data: createRoleDto,
    });
  }

  async findAll() {
    return await prisma.role.findMany();
  }

  async findOne(id: number) {
    return await prisma.role.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return await prisma.role.update({
      where: {
        id,
      },
      data: updateRoleDto,
    });
  }

  async remove(id: number) {
    return await prisma.role.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(), // soft delete
      },
    });
  }

  async findOneWithName(name: string) {
    return await prisma.role.findUnique({
      where: {
        name,
      },
    });
  }
}
