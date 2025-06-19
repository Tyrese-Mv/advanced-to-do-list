import express from 'express';
import cors from 'cors'
// import type { Response } from 'express';
import { register, login } from '../auth/auth.controller';
import { authenticateJWT } from '../auth/auth.middleware';
import { addTask, AllTasks, removeTask, updateTaskState } from '../controllers/controller.tasks';

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Registers a new user.
 * @route POST /register
 */
app.post('/register', register as express.RequestHandler);
/**
 * Logs in a user and returns a JWT token.
 * @route POST /login
 */
app.post('/login', login as express.RequestHandler);

// app.get('/profile', authenticateJWT, (req: AuthRequest, res: Response): void => {
//   res.json({ email: req.user?.email });
// });

/**
 * Adds a new task for the authenticated user.
 * @route POST /addTask
 */
app.post('/addTask', authenticateJWT, addTask as express.RequestHandler);
/**
 * Retrieves all tasks for the authenticated user.
 * @route GET /tasks
 */
app.get('/tasks', authenticateJWT, AllTasks as express.RequestHandler);
/**
 * Removes a task by ID for the authenticated user.
 * @route DELETE /removeTask/:id
 */
app.delete('/removeTask/:id', authenticateJWT, removeTask as express.RequestHandler);
/**
 * Updates the state of a task by ID for the authenticated user.
 * @route PUT /updateTaskState/:id
 */
app.put('/updateTaskState/:id', authenticateJWT, updateTaskState as express.RequestHandler);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));