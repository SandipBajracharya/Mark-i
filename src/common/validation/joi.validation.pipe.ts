import {
  PipeTransform,
  Injectable,
  // ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export default class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value);
    if (error) {
      const errors = error.details.map((err) => {
        return {
          field: err.context.label,
          message: err.message,
        };
      });
      throw new BadRequestException({ errors });
    }
    return value;
  }
}
