import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthenticationLoginDto } from './dto/authentication-login.dto';
import JoiValidationPipe from '@/common/validation/joi.validation.pipe';
import { authenticationSchema } from './authentication.validation';
import { UsersService } from '../users/users.service';
import { matchPassword } from '@/utils/password';
import { JwtAuthService } from '@/service/jwt.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CustomError } from '@/common/custom/customError';
import { AuthenticationService } from './authentication.service';
import { AuthenticationQueryDto } from './dto/authentication-query.dto';
import { UserAttrubute } from '../users/dto/common.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtAuthService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Post('/login')
  async login(
    @Body(new JoiValidationPipe(authenticationSchema))
    authenticationLoginDto: AuthenticationLoginDto,
  ) {
    try {
      const attributes: UserAttrubute[] = [
        'id',
        'email',
        'password',
        'first_name',
        'last_name',
        'middle_name',
        'role_id',
        'email_verified_at',
        'deleted_at',
      ];
      // 1. check if user with the email is in database
      const userInfo = await this.userService.findOneWithEmail(
        authenticationLoginDto.email,
        attributes,
      );
      if (!userInfo)
        throw new CustomError('User with the given email is not found!', 404);

      if (userInfo && userInfo.deleted_at)
        throw new CustomError(
          'This user is not active! Please contact administration',
          400,
        );
      delete userInfo.deleted_at;

      // 2. check if password matches
      const isMatchedPassword = await matchPassword(
        authenticationLoginDto.password,
        userInfo?.password,
      );

      if (!isMatchedPassword)
        throw new CustomError('Credentials do not match!', 400);

      const token = await this.jwtService.generateToken(userInfo);

      return { data: { tokenType: 'Bearer', token }, message: 'Login success' };
    } catch (error) {
      throw error;
    }
  }

  @Post('/register')
  async register(@Body() authenticationRegisterDto: CreateUserDto) {
    try {
      // 1. Create User logic
      const user = await this.userService.create(authenticationRegisterDto);

      // 2. Send email for verification
      this.authenticationService.registerVerification(user); // use bravo instead of Mailtrap (better offer in bravo)
      return {
        data: user,
        message: 'Registration success. Email has been sent to verify',
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('/verify')
  async verify(@Query() query: AuthenticationQueryDto) {
    try {
      const res = await this.authenticationService.verifyProcess(query);
      return { data: res };
    } catch (error) {
      throw error;
    }
  }
}
