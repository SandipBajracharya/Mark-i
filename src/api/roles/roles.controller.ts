import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { createRoleSchema } from './roles.validation';
import JoiValidationPipe from 'src/common/validation/joi.validation.pipe';

@Controller('api/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(
    @Body(new JoiValidationPipe(createRoleSchema)) createRoleDto: CreateRoleDto,
  ) {
    try {
      const role = await this.rolesService.create(createRoleDto);
      return { data: role, message: 'Data stored successfully' };
    } catch (error) {
      return { data: null, message: error.message };
    }
  }

  @Get()
  async findAll() {
    try {
      const role = await this.rolesService.findAll();
      return { data: role, message: 'Data fetch success' };
    } catch (error) {
      return { data: null, message: error.message };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const role = await this.rolesService.findOne(+id);
      return { data: role, message: 'Data fetch success' };
    } catch (error) {
      return { data: null, message: error.message };
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(createRoleSchema)) updateRoleDto: UpdateRoleDto,
  ) {
    try {
      const role = await this.rolesService.update(+id, updateRoleDto);
      return { data: role, message: 'Data update success' };
    } catch (error) {
      return { data: null, message: error.message };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const role = await this.rolesService.remove(+id);
      return { data: role, message: 'Data delete success' };
    } catch (error) {
      return { data: null, message: error.message };
    }
  }
}
