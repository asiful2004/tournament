import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { emailService } from './emailService';
import { randomUUID } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'development-jwt-secret-key';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (userId: string, email: string, role: string): string => {
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role || 'user',
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export const generatePasswordResetToken = async (email: string): Promise<string | null> => {
  const user = await storage.getUserByEmail(email);
  if (!user) {
    return null;
  }

  const token = randomUUID();
  const expires = new Date();
  expires.setHours(expires.getHours() + 1); // 1 hour from now

  await storage.updateUser(user.id, {
    passwordResetToken: token,
    passwordResetExpires: expires,
  });

  return token;
};

export const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
  const user = await storage.getUserByResetToken(token);
  if (!user || !user.passwordResetExpires || new Date() > user.passwordResetExpires) {
    return false;
  }

  const hashedPassword = await hashPassword(newPassword);
  await storage.updateUser(user.id, {
    password: hashedPassword,
    passwordResetToken: null,
    passwordResetExpires: null,
  });

  return true;
};

export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  const resetUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/reset-password?token=${token}`;
  
  // This function would be implemented if needed
  console.log('Password reset email would be sent to:', email, 'with token:', token);
};