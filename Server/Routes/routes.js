import express from 'express';
import { login } from '../Controllers/controller.js';

const router = express.Router();

router.post('/login',login)

export default router;