import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


//gonna fix this
const users: { email: string; passwordHash: string }[] = [];
const JWT_SECRET = process.env.JWT_SECRET!;


/**
 * Authentication controller for user registration and login.
 * Handles password hashing, JWT generation, and user storage (in-memory).
 */
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ email, passwordHash });

  res.status(201).json({ message: 'User registered' });
};

/**
 * Registers a new user by hashing the password and storing the user in memory.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '100h' });

  res.json({ token });
};

/**
 * Logs in a user by verifying credentials and returns a JWT token if successful.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
