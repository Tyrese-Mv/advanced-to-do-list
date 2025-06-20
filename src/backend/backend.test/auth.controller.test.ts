import { register, login } from '../auth/auth.controller';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';

describe('auth.controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    // Reset users array if possible (users is in module scope)
    // jest.resetModules();
  });

  describe('register', () => {
    it('should register a user and return 201', async () => {
      req.body = { email: 'test@example.com', password: 'pass123' };
      await register(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'User registered' });
    });
  });

  describe('login', () => {
    it('should return 401 if user not found', async () => {
      req.body = { email: 'nouser@example.com', password: 'pass123' };
      await login(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return 401 if password does not match', async () => {
      // Register user first
      req.body = { email: 'test@example.com', password: 'pass123' };
      await register(req as Request, res as Response);
      req.body = { email: 'test@example.com', password: 'wrongpass' };
      await login(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return a token if credentials are valid', async () => {
      req.body = { email: 'test@example.com', password: 'pass123' };
      await register(req as Request, res as Response);
      req.body = { email: 'test@example.com', password: 'pass123' };
      await login(req as Request, res as Response);
      const calls = (res.json as jest.Mock).mock.calls;
      const token = calls[calls.length - 1][0].token;
      expect(token).toBeDefined();
      // Optionally, verify the token
      
      const decoded = jwt.decode(token);
      if (typeof decoded === 'object' && decoded !== null) {
        expect((decoded as { email?: string }).email).toBe('test@example.com');
      } else {
        throw new Error('Decoded JWT is not an object');
      }
    });
  });
}); 