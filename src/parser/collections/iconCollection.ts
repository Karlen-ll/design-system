import { IconToken } from '@/parser/tokens'

export default class IconCollection {
  public icons: IconToken[] = []

  public addToken(token: IconToken) {
    this.icons.push(token)
  }
}
