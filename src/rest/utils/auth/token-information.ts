export enum TokenType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
}

export type TokenInformation = {
  userId: number;
  tokenType: TokenType;
};
