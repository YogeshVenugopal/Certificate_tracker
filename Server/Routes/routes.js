import express from 'express';
import { login, getDocument, createStudent, deleteAllData, getEditableStudent, getStudent } from '../Controllers/controller.js';

const router = express.Router();

router.post('/login',login)
router.get('/getDocument/:document', getDocument);
router.post('/create-student', createStudent);
router.delete('/delete-all', deleteAllData);
router.get('/get-student', getEditableStudent);
router.get('/getStudent/:admission_no', getStudent)

export default router;