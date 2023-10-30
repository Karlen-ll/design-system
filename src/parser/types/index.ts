export type FileComment = (string | number)[] | (string | number)

export type StyleProperties = Record<string, number | string>

/*#region Tokens*/
export interface StyleToken {
  getStyleProperties(): StyleProperties
}
/*#endregion Tokens*/
