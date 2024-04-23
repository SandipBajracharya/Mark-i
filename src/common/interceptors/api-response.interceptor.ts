import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ApiResponse, ControllerResponse } from '../dto/api-response.dto';
import { Observable, map } from 'rxjs';
import {
  CLIENT_ERROR,
  CREATED,
  SERVER_ERROR,
  SUCCESS,
} from '../constants/http-status-code';
import {
  CLIENT_ERROR_RESPONSE,
  SERVER_ERROR_RESPONSE,
  SUCCESS_RESPONSE,
} from '../constants/http-response';

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<ControllerResponse<T>, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<ControllerResponse<T>>, // ControllerResponse works as param DTO
  ): Observable<ApiResponse<T>> | Promise<Observable<ApiResponse<T>>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    // console.log('context: ', context.getArgs());
    console.log({ context }, context.switchToHttp().getResponse());
    let msg = '';

    switch (statusCode) {
      case SUCCESS:
        msg = SUCCESS_RESPONSE;
        break;

      case CREATED:
        msg = SUCCESS_RESPONSE;
        break;

      case SERVER_ERROR:
        msg = SERVER_ERROR_RESPONSE;
        break;

      case CLIENT_ERROR:
        msg = CLIENT_ERROR_RESPONSE;
        break;

      default:
        break;
    }

    return next.handle().pipe(
      map((data) => {
        return {
          data: data.data || null,
          message: data.message || msg,
          statusCode,
        };
      }),
    );
  }
}
