import { Router } from 'express';
import multer from 'multer';

import UsersController from '../controllers/UsersController';
import SessionController from '../controllers/SessionController';
import CoursesController from '../controllers/CoursesController';
import LessonsController from '../controllers/LessonsController';

import multerConfig from '../config/multer';

const routes = Router();
const upload = multer(multerConfig.multer);

const usersController = new UsersController();
const sessionController = new SessionController();
const courseController = new CoursesController();
const lessonController = new LessonsController();

routes.post('/users', usersController.create)
routes.post('/session', sessionController.store);

routes.post('/courses', upload.single('file'), courseController.create);
routes.put('/courses/:id', upload.single('file'), courseController.update);
routes.get('/courses', courseController.listAll);

routes.post('/lessons', lessonController.create);
routes.put('/lessons/:id', lessonController.update);
routes.get('/lessons/:id', lessonController.listById);
routes.get('/courses/:course_id/lessons', lessonController.listAllByCourse);

export default routes;
