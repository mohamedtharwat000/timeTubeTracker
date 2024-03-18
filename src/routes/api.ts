/* eslint-disable @typescript-eslint/unbound-method */
import express from 'express';
import UserController from '../controllers/usersController';
import AppController from '../controllers/AppController';

const router = express.Router();


router.post('/signup', UserController.singUpPost);
router.post('/login', UserController.loginPost);

router.get('/status', AppController.status);

export default router;

