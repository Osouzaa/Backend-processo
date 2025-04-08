import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUser {
  sub: number
  email: string
  role: string;
  iat: number
  exp: number
}

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): CurrentUser => {
    const user = getCurrentUserByContext(ctx)!; // <- o `!` diz ao TS que você garante que não será undefined
    return user;
  },
);

export const getCurrentUserByContext = (
  ctx: ExecutionContext,
): CurrentUser | undefined => {
  try {
    if (ctx.getType() === 'http') {
      const user = ctx.switchToHttp().getRequest().user;
      return user;
    }
  } catch (error) {
    console.error('Error getting user from context:', error);
  }

  return undefined;
};