import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createUserSchema } from './users.validation';
import JoiValidationPipe from '@/common/validation/joi.validation.pipe';
import { DATA_FETCH_SUCCESS } from '@/common/constants/http-response';
// import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

// @UseInterceptors(CacheInterceptor) // caching whole service (only get functions)
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
      throw error;
    }
  }

  @Get('')
  // @CacheKey('user_find_all') // need to enable global cache interceptor for this to work.
  // @CacheTTL(6000) // in miliseconds
  async findAll() {
    try {
      const user = await this.usersService.findAll();
      return { data: user, message: 'Data list fetch success' };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('minimal') minimal?: string) {
    try {
      const user = await this.usersService.findOne(+id, minimal);
      return { data: user, message: DATA_FETCH_SUCCESS };
    } catch (error) {
      throw error;
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
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      const user = this.usersService.remove(+id);
      return { data: user, message: 'Data deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
