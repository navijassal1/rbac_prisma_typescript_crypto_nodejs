import { User, Category } from '@prisma/client';
import { TokenUserParams } from "../types/user.types.ts";

/**
 * Extend Express.Request to include custom properties used in our app.
 * This allows TypeScript to know about these fields when accessed in middleware or controllers.
 */
declare global {
  namespace Express {
    interface Request {
      /**
       * The user who is currently logged in through a session.
       * Typically populated by session-based authentication (if used).
       */
      currentUser?: User;

      /**
       * The user extracted from a verified JWT token.
       * Populated by `verifyToken` middleware.
       */
      tokenUser: TokenUserParams;

      /**
       * Target user's ID for CRUD operations (update, delete, fetch details)
       * Populated by route param middleware (`attachTargetUser`)
       */
      targetUserId?: number;

      /**
       * Target category's ID for CRUD operations on categories
       * Populated by route param middleware (`attachTargetCategory`)
       */
      targetCategoryId?: number;
    }
  }
}
