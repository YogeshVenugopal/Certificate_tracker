import express from 'express';
import { getColumnValues, login } from '../Controller/controller.js';

const router = express.Router();

router.post('/login', login);
router.get('/documents/:columnName', getColumnValues);

export default router;