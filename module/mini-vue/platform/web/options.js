import { isUnaryTag, canBeLeftOpenTag } from './utils'

export const baseOptions = {
  expectHTML: true,
  isPreTag: tag => tag === 'pre',
  isUnaryTag,
}
