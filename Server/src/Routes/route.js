import express from 'express';
import { createStudents, getColumnValues, login } from '../Controller/controller.js';

const router = express.Router();

router.post('/login', login);
router.get('/documents/:columnName', getColumnValues);
router.get('/create-student', createStudents)

export default router;