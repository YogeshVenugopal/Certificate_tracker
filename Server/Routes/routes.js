import express from 'express';
import { login, getDocument, createStudent, deleteAllData, getEditableStudent, getStudent, updateStudent } from '../Controllers/controller.js';

const router = express.Router();

router.post('/login',login)
router.get('/getDocument/:document', getDocument);
router.post('/create-student', createStudent);
router.delete('/delete-all', deleteAllData);
router.get('/get-student', getEditableStudent);
router.get('/getStudent/:admission_no', getStudent)
router.put('/updateStudent/:admission_no', updateStudent);
export default router;