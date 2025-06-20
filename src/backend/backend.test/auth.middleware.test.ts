import { authenticateJWT, AuthRequest } from '../auth/auth.middleware';
import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

describe('authenticateJWT middleware', () => {
  
  // const OLD_ENV = process.env;

  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  let next: jest.Mock;

  // beforeAll(() => {
  //   process.env.JWT_SECRET = JWT_SECRET;
  // });
  // afterAll(() => {
  //   process.env = OLD_ENV;
  // });

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it('should call next and set req.user if token is valid', () => {
    const token = jwt.sign( { email: 'test@example.com' } , JWT_SECRET);
    req.headers = { authorization: `Bearer ${token}` };
    
    authenticateJWT(req as AuthRequest, res as Response, next as NextFunction);
    console.log("User on test: ", req.user)
    expect(req.user).toEqual({ email: 'test@example.com' });
    expect(next).toHaveBeenCalled();
    
  });

  it('should return 401 if no authorization header', () => {
    authenticateJWT(req as AuthRequest, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header does not start with Bearer', () => {
    req.headers = { authorization: 'Token abc' };
    authenticateJWT(req as AuthRequest, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if token is invalid', () => {
    req.headers = { authorization: 'Bearer invalidtoken' };
    authenticateJWT(req as AuthRequest, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect((res.json as jest.Mock).mock.calls[0][0].message).toMatch(/Invalid token/);
    expect(next).not.toHaveBeenCalled();
  });
}); 