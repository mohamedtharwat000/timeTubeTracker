/* eslint-disable @typescript-eslint/unbound-method */
import express from 'express';
import Middleware from '../utils/middleware';

const router = express.Router();

router.get('*', Middleware.checkUser);
router.get('/', (_req, res) => {
    res.send('Main route');
});

export default router;
