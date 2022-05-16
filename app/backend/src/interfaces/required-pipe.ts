import {
    ArgumentMetadata,
    BadRequestException,
    PipeTransform
  } from '@nestjs/common';
  
  export class RequiredPipe<T> implements PipeTransform<T, NonNullable<T>> {
    constructor(private readonly errorMessage?: string) {}
  
    public transform(value: T, _metadata: ArgumentMetadata): NonNullable<T> {
      if (value) {
        return value as NonNullable<T>;
      } else {
        throw this.errorMessage
          ? new BadRequestException({ errorView: this.errorMessage })
          : new BadRequestException();
      }
    }
  }