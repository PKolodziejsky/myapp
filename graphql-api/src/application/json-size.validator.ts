import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function MaxStringifiedLength(length: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'MaxStringifiedLength',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: JSON) {
          return JSON.stringify(value).length < length
        },
        defaultMessage(validationArguments?: ValidationArguments): string {
          return 'Object is to large'
        },
      },
    })
  }
}
