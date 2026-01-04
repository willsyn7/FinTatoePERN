import { admin } from '../config/google-auath.config';

interface TokenPayload {
  userId: string;
  email: string;
}

interface DecodedToken {
  uid: string;
  email?: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
  [key: string]: any;
}

const authService = {
  /**
   * Generate custom token using Google Identity Platform Admin SDK
   * Google signs this token with their private keys
   * The token can be used to authenticate with Firebase client SDKs
   * Store the verified token in res.locals after verification
   */
  generateCustomToken: async (payload: TokenPayload): Promise<string> => {
    try {
      const { userId, email } = payload;

      // Create custom token signed by Google Identity Platform
      // Service account must have roles/iam.serviceAccountTokenCreator role
      const customToken = await admin.auth().createCustomToken(userId, {
        email,
        // Additional custom claims can be added here
      });

      return customToken;
    } catch (error) {
      console.error('Error generating custom token:', error);
      throw new Error('Failed to generate authentication token');
    }
  },

  /**
   * Verify ID token signed by Google
   * This verifies tokens that clients get after authenticating with the custom token
   * Returns decoded token to be stored in res.locals
   */
  verifyIdToken: async (idToken: string): Promise<DecodedToken> => {
    try {
      // Verify token using Google's public keys
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Error verifying ID token:', error);
      if (error instanceof Error) {
        if (error.message.includes('expired')) {
          throw new Error('Token has expired');
        }
        if (error.message.includes('invalid')) {
          throw new Error('Invalid token');
        }
      }
      throw new Error('Token verification failed');
    }
  },

  /**
   * Generate tokens for login response
   * Returns custom token that client will exchange for ID token
   */
  generateTokens: async (payload: TokenPayload) => {
    const customToken = await authService.generateCustomToken(payload);

    return {
      customToken,
      // Client will use this custom token to get an ID token from Firebase
      // ID token is what gets sent back in subsequent requests
    };
  },

  /**
   * Revoke all refresh tokens for a user (sign out from all devices)
   */
  revokeRefreshTokens: async (userId: string): Promise<void> => {
    try {
      await admin.auth().revokeRefreshTokens(userId);
      console.log(`Revoked refresh tokens for user: ${userId}`);
    } catch (error) {
      console.error('Error revoking tokens:', error);
      throw new Error('Failed to revoke refresh tokens');
    }
  },

  /**
   * Get user information from Firebase Auth
   */
  getUserById: async (userId: string) => {
    try {
      const userRecord = await admin.auth().getUser(userId);
      return userRecord;
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error('User not found in Firebase Auth');
    }
  },

  /**
   * Create session cookie from custom token (for testing only)
   * This allows server-to-server authentication without Firebase client SDK
   * Session cookies can be verified just like ID tokens
   */
  createSessionCookie: async (customToken: string, expiresIn: number = 3600000): Promise<string> => {
    try {
      // First, we need to get an ID token from the custom token
      // Unfortunately, Admin SDK doesn't provide this directly
      // We'll create a session cookie-like JWT manually

      // Alternative: Create a custom JWT that mimics ID token structure
      // This is for testing purposes only
      throw new Error('Session cookie creation requires Firebase client SDK or REST API');
    } catch (error) {
      console.error('Error creating session cookie:', error);
      throw new Error('Failed to create session cookie');
    }
  },
};

export { authService, TokenPayload, DecodedToken };
