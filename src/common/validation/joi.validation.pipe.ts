import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export default class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    console.log({ metadata });
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException(
        'Validation failed: ' + error.details.map((i) => i.message).join(', '),
      );
    }
    return value;
  }
}
