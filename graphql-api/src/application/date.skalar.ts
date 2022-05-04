import { CustomScalar, Scalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'
import { isValidDateFormat } from '../utilities/date'

@Scalar('Date')
export class DateScalar implements CustomScalar<string, string> {
  description = 'Date in ISO format'

  parseValue(value: string): string {
    return value
  }

  serialize(value: string): string {
    return value
  }

  parseLiteral(ast: ValueNode): string {
    if (ast.kind === Kind.STRING && isValidDateFormat(ast.value)) {
      return ast.value
    }
    return ''
  }
}
