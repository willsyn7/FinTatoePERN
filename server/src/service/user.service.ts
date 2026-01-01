import { userRepository } from "../repository/user.repository";
import { createUserInterface } from "../interfaces/userInterface";
import argon2 from 'argon2';
import { authService } from './auth.service';

const userService = {
  // Validate unique email
  validateUniqueEmail: async (email: string): Promise<void> => {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }
  },

  // Hash password using Argon2
  hashPassword: async (password: string): Promise<string> => {
    return await argon2.hash(password);
  },

  // Verify password using Argon2
  verifyPassword: async (hashedPassword: string, plainPassword: string): Promise<boolean> => {
    return await argon2.verify(hashedPassword, plainPassword);
  },

  // Create user with validation and hashing
  createUser: async (params: Omit<createUserInterface, 'id'>) => {
    const { email, password, first_Name, last_Name } = params;

    // Validate unique email
        try {
      await userService.validateUniqueEmail(email);
    } catch (error) {
      throw new Error('Email already exists');
    }

    // Hash password with Argon2
    const hashedPassword = await userService.hashPassword(password);

    // Generate ID
    const id = crypto.randomUUID();

    // Create user in database
    const user = await userRepository.createUser({
      id,
      email,
      password: hashedPassword,
      first_Name,
      last_Name
    });



    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  },
loginUser: async (email: string, password: string) => {
    // Find user by email
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password using Argon2
    const isValidPassword = await userService.verifyPassword(user.password, password);

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Generate JWT tokens using Google Identity Platform
    const tokens = await authService.generateTokens({
      userId: user.id,
      email: user.email
    });

    return {
      user: userWithoutPassword,
      tokens
    };
  },

  // Revoke all refresh tokens for a user (logout from all devices)
  revokeUserTokens: async (userId: string): Promise<void> => {
    await authService.revokeRefreshTokens(userId);
  }
}
export { userService };