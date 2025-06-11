import express from 'express';
// import type { Response } from 'express';
import { register, login } from '../auth/auth.controller';
import { authenticateJWT } from '../auth/auth.middleware';
import { addTask, AllTasks, removeTask } from '../controllers/controller.tasks';

const app = express();
app.use(express.json());

app.post('/register', register as express.RequestHandler);
app.post('/login', login as express.RequestHandler);

// app.get('/profile', authenticateJWT, (req: AuthRequest, res: Response): void => {
//   res.json({ email: req.user?.email });
// });

app.post('/addTask', authenticateJWT, addTask as express.RequestHandler);
app.get('/tasks', authenticateJWT, AllTasks as express.RequestHandler);
app.delete('/removeTask/:id', authenticateJWT, removeTask as express.RequestHandler);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));