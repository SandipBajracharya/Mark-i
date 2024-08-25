import { Controller, Get } from '@nestjs/common';

@Controller('')
export class HomeController {
  @Get('/')
  async home() {
    try {
      return {
        message: 'Welcome to Mark-I',
      };
    } catch (error) {
      throw error;
    }
  }
}
