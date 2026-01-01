import { Request, Response, NextFunction } from 'express';
import { authService, DecodedToken } from '../service/auth.service';

// Extend Express Response to include typed locals
declare global {
  namespace Express {
    interface Locals {
      user?: DecodedToken;
    }
  }
}

const authMiddleware = {
  /**
   * Verify Google-signed ID token from Authorization header
   * Stores decoded token in res.locals.user for route handlers
   */
  verifyToken: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
      }

      // Extract ID token (remove 'Bearer ' prefix)
      const idToken = authHeader.substring(7);

      // Verify token using Google Identity Platform Admin SDK
      // This validates the token was signed by Google
      const decodedToken = await authService.verifyIdToken(idToken);

      // Store decoded token in res.locals for use in route handlers
      res.locals.user = decodedToken;

      next();
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: `Unauthorized: ${error.message}` });
      } else {
        res.status(401).json({ error: 'Unauthorized: Token verification failed' });
      }
    }
  },

  /**
   * Optional authentication - verify token if present, but don't require it
   * Useful for routes that work for both authenticated and non-authenticated users
   */
  optionalAuth: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const idToken = authHeader.substring(7);
        const decodedToken = await authService.verifyIdToken(idToken);
        res.locals.user = decodedToken;
      }

      next();
    } catch (error) {
      // Don't fail if token is invalid, just continue without user
      next();
    }
  },

  /**
   * Require specific custom claims (e.g., roles, permissions)
   * Use this after verifyToken middleware
   */
  requireClaim: (claimKey: string, claimValue: any) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      const user = res.locals.user;

      if (!user) {
        res.status(401).json({ error: 'Unauthorized: No user found' });
        return;
      }

      if (user[claimKey] !== claimValue) {
        res.status(403).json({ 
          error: `Forbidden: Required claim ${claimKey}=${claimValue} not found` 
        });
        return;
      }

      next();
    };
  },
};

export { authMiddleware };
