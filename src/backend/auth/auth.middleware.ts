import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';



/**
 * Extended Express Request interface to include user email.
 */
export interface AuthRequest extends Request {
  user?: { email: string };
}

/**
 * Middleware to authenticate JWT tokens in incoming requests.
 * @param {AuthRequest} req - Express request object with optional user property.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const JWT_SECRET = process.env.JWT_SECRET!;
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { email: string };
    req.user = { email: payload.email };
    next();
  } catch (err) {
    res.status(403).json({ message: `Invalid token: ${err}` });
    return;
  }
};
