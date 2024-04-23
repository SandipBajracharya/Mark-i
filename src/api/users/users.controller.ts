import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createUserSchema } from './users.validation';
import JoiValidationPipe from 'src/common/validation/joi.validation.pipe';
import { DATA_FETCH_SUCCESS } from 'src/common/constants/http-response';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('')
  async create(
    @Body(new JoiValidationPipe(createUserSchema))
    createUserDto: CreateUserDto,
  ) {
    try {
      const user = await this.usersService.create(createUserDto);
      return { data: user, message: 'Data stored successfully' };
    } catch (error) {
      console.log(error);
      return { data: null, message: error.message };
    }
  }

  @Get('')
  async findAll() {
    try {
      const user = await this.usersService.findAll();
      return { data: user, message: 'Data list fetch success' };
    } catch (error) {
      return { data: null, message: error.message };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(+id);
      return { data: user, message: DATA_FETCH_SUCCESS };
    } catch (error) {
      console.log({ error });
      return { data: null, message: error.message };
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.usersService.update(+id, updateUserDto);
      return { data: user, message: 'Data updated Successfully' };
    } catch (error) {
      console.log({ error });
      return { data: null, message: error.message };
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      const user = this.usersService.remove(+id);
      return { data: user, message: 'Data deleted successfully' };
    } catch (error) {
      return { data: null, message: error.message };
    }
  }
}
