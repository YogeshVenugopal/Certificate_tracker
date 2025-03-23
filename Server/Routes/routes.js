import express from 'express';
import { login, getDocument, createStudent, deleteAllData, getEditableStudent, getStudent, updateStudent, searchStudent, downloadStudent, getPdf, generateExcelReport } from '../Controllers/controller.js';

const router = express.Router();

router.post('/login',login)
router.get('/getDocument/:document', getDocument);
router.post('/create-student', createStudent);
router.delete('/delete-all', deleteAllData);
router.get('/get-student', getEditableStudent);
router.get('/getStudent/:admission_no/:version', getStudent)
router.put('/updateStudent/:admission_no', updateStudent);
router.get('/get-document-download', downloadStudent);
router.get('/search-student/:admission_no/:locked', searchStudent);
// router.get('/downloadStudent/:admission_no', downloadStudentXL);
router.get('/pdfDownloader/:admission_no/:version', getPdf)
router.post('/generateExcel', generateExcelReport)


export default router;