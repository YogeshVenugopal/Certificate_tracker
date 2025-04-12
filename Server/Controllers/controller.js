import pool from "../Config/db.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import transporter from "../Config/email.js";
import dotenv from "dotenv";

dotenv.config();

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Please enter both username and password." });
    }

    try {
        const userQuery = "SELECT * FROM users WHERE userId = $1";
        const result = await pool.query(userQuery, [username]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = result.rows[0];

        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid password" });
        }

        res.status(200).json({ message: "Login successful", username: user.username });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error." });
    }
}

export const getDocument = async (req, res) => {
    const { document } = req.params;
    if (!document) {
        res.status(400).json({ error: "Document type not defined." });
    }
    try {
        const searchDocumentQuery = "SELECT * FROM documents WHERE type = $1";
        const result = await pool.query(searchDocumentQuery, [document]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Document not found" });
        }

        res.status(200).json({ data: result.rows });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error." });
    }
}

export const createStudent = async (req, res) => {
    const postData = req.body;
    if (
        !postData ||
        typeof postData.admission_no !== 'string' ||
        typeof postData.name !== 'string' ||
        typeof postData.email !== 'string' ||
        typeof postData.department !== 'string' ||
        typeof postData.student_no !== 'number' ||
        typeof postData.parent_name !== 'string' ||
        typeof postData.parent_no !== 'number' ||
        typeof postData.username !== 'string'
    ) {
        return res.status(400).json({ message: "Missing or invalid required fields." });
    }

    const { quota, admission_no, name, email, department, student_no, parent_name, parent_no, files, studies, username, remark } = postData;

    try {
        await pool.query("BEGIN");

        const checkStudent = await pool.query(
            'SELECT admission_no FROM "student" WHERE admission_no = $1 FOR UPDATE',
            [admission_no]
        );

        if (checkStudent.rows.length > 0) {
            await pool.query("ROLLBACK");
            return res.status(400).json({ message: "Student already exists" });
        }


        await pool.query(
            'INSERT INTO "student" (admission_no, version_count, lock) VALUES ($1, $2, $3)',
            [admission_no, 0, false]
        );

        await pool.query(
            'INSERT INTO "versions" (student, version_count, student_version, doc_version, username, date) VALUES ($1, $2, $3, $4, $5, $6)',
            [admission_no, 0, 0, 0, username, new Date()]
        );

        await pool.query(
            'INSERT INTO "remarks" (student, username, remark) VALUES ($1, $2, $3)',
            [admission_no, username, remark]
        );


        const quotaValue = quota ?? null;
        const studiesValue = studies ?? null;

        await pool.query(
            'INSERT INTO "student_info" (name, student, email, department, student_no, parent_no, parent_name, quota, studies, username, version, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12)',
            [name, admission_no, email, department, student_no, parent_no, parent_name, quotaValue, studiesValue, username, 0, new Date()]
        );

        if (Array.isArray(files) && files.length > 0) {
            for (const file of files) {
                if (!file.name || typeof file.name !== 'string') {
                    console.warn("Skipping file entry due to missing name:", file);
                    continue;
                }

                const countValue = Number.isInteger(file.count) ? file.count : 0;
                const originalValue = file.original ?? false;
                const photocopyValue = file.photocopy ?? false;
                await pool.query(
                    `INSERT INTO "record" (student, name, original, photocopy, count, ver, date) 
                     VALUES ($1, $2, $3, $4, $5, $6,$7)`,
                    [admission_no, file.name, originalValue, photocopyValue, countValue, 0, new Date()]
                );
            }
        }

        const mailOptions = {
            from: process.env.SENDER_MAIL,
            to: email,
            subject: `Welcome ${name}, your data has been created successfully!`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                    <h2 style="color: #4CAF50;">Student Registration Confirmation</h2>
                    <p>Dear ${name},</p>
                    <p>Your student data has been successfully created. Below are your details:</p>
        
                    <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%; text-align: left;">
                        <tr style="background-color: #f2f2f2;">
                            <th>Field</th>
                            <th>Details</th>
                        </tr>
                        <tr>
                            <td><strong>Admission Number</strong></td>
                            <td>${admission_no}</td>
                        </tr>
                        <tr>
                            <td><strong>Student Name</strong></td>
                            <td>${name}</td>
                        </tr>
                        <tr>
                            <td><strong>Personal Email</strong></td>
                            <td>${email}</td>
                        </tr>
                        <tr>
                            <td><strong>Department</strong></td>
                            <td>${department}</td>
                        </tr>
                        <tr>
                            <td><strong>Student Number</strong></td>
                            <td>${student_no}</td>
                        </tr>
                        <tr>
                            <td><strong>Parent Name</strong></td>
                            <td>${parent_name}</td>
                        </tr>
                        <tr>
                            <td><strong>Parent Number</strong></td>
                            <td>${parent_no}</td>
                        </tr>
                        <tr>
                            <td><strong>Quota</strong></td>
                            <td>${quota ?? 'N/A'}</td>
                        </tr>
                        <tr>
                            <td><strong>Studies</strong></td>
                            <td>${studies ?? 'N/A'}</td>
                        </tr>
                    </table>
        
                    <h3 style="margin-top: 20px;">Documents Submitted</h3>
                    ${Array.isArray(files) && files.length > 0 ? `
                        <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%; text-align: left;">
                            <tr style="background-color: #f2f2f2;">
                                <th>Document Name</th>
                                <th>Original</th>
                                <th>Photocopy</th>
                                <th>Count</th>
                            </tr>
                            ${files.map(file => `
                                <tr>
                                    <td>${file.name}</td>
                                    <td>${file.original ? 'Yes' : 'No'}</td>
                                    <td>${file.photocopy ? 'Yes' : 'No'}</td>
                                    <td>${file.count ?? 0}</td>
                                </tr>
                            `).join('')}
                        </table>
                    ` : '<p>No documents submitted.</p>'}
        
                    <p>If you have any questions, feel free to contact us.</p>
                    <p>Best Regards,<br>Admin Team</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);        
        await pool.query("COMMIT");
        return res.status(201).json({ message: "Student records inserted successfully" });

    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error inserting student records:", error);
        return res.status(500).json({ error: error.message || "Failed to create student records" });
    }
};

export const deleteAllData = async (req, res) => {
    try {
        await pool.query("TRUNCATE TABLE student_info CASCADE");
        await pool.query("TRUNCATE TABLE record CASCADE");
        await pool.query("TRUNCATE TABLE versions CASCADE");
        await pool.query("TRUNCATE TABLE student CASCADE");
        res.status(200).json({ message: "All data deleted successfully" });
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ error: "Failed to delete data" });
    }
}


export const getEditableStudent = async (req, res) => {
    try {
        const studentsQuery = `
            SELECT s.admission_no, si.*
            FROM student s
            LEFT JOIN (
                SELECT DISTINCT ON (student) * 
                FROM student_info 
                ORDER BY student, version DESC
            ) si ON si.student = s.admission_no
            WHERE s.lock = false;
        `;

        const { rows: students } = await pool.query(studentsQuery);

        if (students.length === 0) {
            return res.status(404).json({ message: "No editable students found" });
        }

        res.status(200).json({ data: students });
    } catch (error) {
        console.error("Error fetching editable students:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getStudent = async (req, res) => {
    try {
        const { admission_no, version } = req.params;

        if (!admission_no) {
            return res.status(400).json({ error: 'Admission number is required' });
        }

        if (!version) {
            return res.status(400).json({ error: 'Version is required' });
        }

        const studentQuery = `SELECT admission_no, version_count FROM student WHERE admission_no = $1`;
        const studentResult = await pool.query(studentQuery, [admission_no]);

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const student = studentResult.rows[0];

        const studentInfoQuery = `
            SELECT name, email, department, student_no, parent_no, quota, version, studies, parent_name, username , date
            FROM student_info
            WHERE student = $1 and version = $2
        `;
        const studentInfoResult = await pool.query(studentInfoQuery, [admission_no, version]);

        if (studentInfoResult.rows.length === 0) {
            return res.status(404).json({ error: 'Student info not found for this version' });
        }

        const studentInfo = studentInfoResult.rows[0];

        const recordQuery = `
            SELECT name, original, photocopy, count, ver
            FROM record
            WHERE student = $1 AND ver = $2
        `;
        const recordResult = await pool.query(recordQuery, [admission_no, version]);
        const files = recordResult.rows;

        const remarksQuery = `SELECT remark FROM remarks WHERE student = $1`;
        const remarksResult = await pool.query(remarksQuery, [admission_no]);
        const remark = remarksResult.rows.length > 0 ? remarksResult.rows[0].remark : null;

        res.json({
            admission_no: student.admission_no,
            ...studentInfo,
            files,
            remark
        });

    } catch (error) {
        console.error('Error fetching student details:', error.message, error.stack);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}

export const updateStudent = async (req, res) => {
    const { admission_no } = req.params;
    const { name, email, department, parent_name, quota, locked, studies, files, modifier, remark } = req.body;
    const parent_no = parseInt(req.body.parent_no, 10);
    const student_no = parseInt(req.body.student_no, 10);

    try {
        await pool.query("BEGIN");

        if (!admission_no) {
            await pool.query("ROLLBACK");
            return res.status(400).json({ error: 'Admission number is required' });
        }

        if (![name, email, department, parent_name, student_no, parent_no, quota, studies, modifier].every(val => val !== undefined)) {
            await pool.query("ROLLBACK");
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!Array.isArray(files)) {
            await pool.query("ROLLBACK");
            return res.status(400).json({ error: 'Invalid files format' });
        }

        const studentRes = await pool.query(
            "SELECT version_count, lock FROM student WHERE admission_no = $1",
            [admission_no]
        );

        if (studentRes.rows.length === 0) {
            await pool.query("ROLLBACK");
            return res.status(400).json({ error: 'Student not found' });
        }

        const currentVersion = studentRes.rows[0].version_count;


        const studentInfoRes = await pool.query(
            `SELECT name, email, department, student_no, parent_no, parent_name, quota, studies, username
             FROM student_info WHERE student = $1 ORDER BY version DESC LIMIT 1`,
            [admission_no]
        );

        let hasStudentInfoChanges = false;
        let hasFileChanges = false;
        let hasRemarkChanges = false;
        let anyChangesDetected = false;

        if (studentInfoRes.rowCount > 0) {
            const existingInfo = studentInfoRes.rows[0];

            hasStudentInfoChanges =
                String(existingInfo.name || '') !== String(name || '') ||
                String(existingInfo.email || '') !== String(email || '') ||
                String(existingInfo.department || '') !== String(department || '') ||
                Number(existingInfo.student_no || 0) !== Number(student_no || 0) ||
                Number(existingInfo.parent_no || 0) !== Number(parent_no || 0) ||
                String(existingInfo.parent_name || '') !== String(parent_name || '') ||
                String(existingInfo.quota || '') !== String(quota || '') ||
                String(existingInfo.studies || '') !== String(studies || '');
        } else {
            hasStudentInfoChanges = true;
        }

        if (files && files.length > 0) {
            const existingFilesRes = await pool.query(
                `SELECT r.name, r.original, r.photocopy, r.count
                 FROM record r
                 INNER JOIN (
                     SELECT name, MAX(ver) as max_ver
                     FROM record
                     WHERE student = $1
                     GROUP BY name
                 ) latest ON r.name = latest.name AND r.ver = latest.max_ver
                 WHERE r.student = $1`,
                [admission_no]
            );

            const existingFiles = existingFilesRes.rows;

            const existingFilesMap = {};
            existingFiles.forEach(file => {
                existingFilesMap[file.name] = {
                    original: file.original,
                    photocopy: file.photocopy,
                    count: file.count
                };
            });

            for (const file of files) {
                const existingFile = existingFilesMap[file.name];

                if (!existingFile) {
                    hasFileChanges = true;
                    break;
                }

                if (
                    String(existingFile.original || '') !== String(file.original || '') ||
                    String(existingFile.photocopy || '') !== String(file.photocopy || '') ||
                    Number(existingFile.count || 0) !== Number(file.count || 0)
                ) {
                    hasFileChanges = true;
                    break;
                }
            }
        
            if (!hasFileChanges) {
                const existingNames = Object.keys(existingFilesMap);
                const newNames = files.map(file => file.name);
                if (existingNames.some(name => !newNames.includes(name))) {
                    hasFileChanges = true;
                }
            }

        }

        if (remark !== undefined) {
            const remarkResult = await pool.query(
                `SELECT remark FROM remarks WHERE student = $1`,
                [admission_no]
            );

            if (remarkResult.rowCount > 0) {
                hasRemarkChanges = String(remarkResult.rows[0].remark || '') !== String(remark || '');
            } else if (remark && remark.trim() !== '') {
                hasRemarkChanges = true;
            }
        }

        anyChangesDetected = hasStudentInfoChanges || hasFileChanges || hasRemarkChanges || locked;
        if (!anyChangesDetected) {
            await pool.query("COMMIT");
            return res.status(200).json({
                message: 'No changes detected, database update skipped',
                version: currentVersion
            });
        }

        let { lock } = studentRes.rows[0];
        lock = locked !== undefined ? locked : lock;

        await pool.query(
            "UPDATE student SET version_count = version_count + 1, lock = $1 WHERE admission_no = $2",
            [lock, admission_no]
        );
    
        await pool.query(
            `INSERT INTO student_info (student, name, email, department, student_no, parent_no, parent_name, quota, studies, version, username, date) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [admission_no, name, email, department, student_no, parent_no, parent_name, quota, studies, currentVersion + 1, modifier, new Date()]
        );


        for (const file of files) {
            const { name, original, photocopy, count } = file;

            if ([name, original, photocopy, count].some(val => val === undefined)) {
                await pool.query("ROLLBACK");
                return res.status(400).json({ error: 'Missing required file fields' });
            }

            const verResult = await pool.query(
                `SELECT COALESCE(MAX(ver), 0) + 1 AS next_ver 
                     FROM record 
                     WHERE student = $1 AND name = $2`,
                [admission_no, name]
            );
            const nextVer = verResult.rows[0].next_ver;

            await pool.query(
                `INSERT INTO record (name, original, photocopy, count, ver, student, date) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [name, original, photocopy, count, nextVer, admission_no,new Date()]
            );
        }

        await pool.query(`
            UPDATE versions SET version_count = $1, doc_version = $1, student_version = $1 WHERE student = $2
        `, [currentVersion + 1, admission_no]);

        if (hasRemarkChanges) {
            const remarkResult = await pool.query(
                `SELECT * FROM remarks WHERE student = $1`,
                [admission_no]
            );

            if (remarkResult.rowCount > 0) {
                await pool.query(
                    `UPDATE remarks SET remark = $1, username = $2 WHERE student = $3`,
                    [remark, modifier, admission_no]
                );
            } else {
                await pool.query(
                    `INSERT INTO remarks (student, remark, username) 
                    VALUES ($1, $2, $3)`,
                    [admission_no, remark, modifier]
                );
            }
        }

        const mailOptions = {
            from: process.env.SENDER_MAIL,
            to: email,
            subject: `Updated Student Information for ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                    <h2 style="color: #4CAF50;">Student Information Updated</h2>
                    <p>Dear ${name},</p>
                    <p>Your student information has been successfully updated. Here are the latest details:</p>
        
                    <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%; text-align: left;">
                        <tr style="background-color: #f2f2f2;">
                            <th>Field</th>
                            <th>Updated Details</th>
                        </tr>
                        <tr>
                            <td><strong>Admission Number</strong></td>
                            <td>${admission_no}</td>
                        </tr>
                        <tr>
                            <td><strong>Student Name</strong></td>
                            <td>${name}</td>
                        </tr>
                        <tr>
                            <td><strong>Personal Email</strong></td>
                            <td>${email}</td>
                        </tr>
                        <tr>
                            <td><strong>Department</strong></td>
                            <td>${department}</td>
                        </tr>
                        <tr>
                            <td><strong>Student Number</strong></td>
                            <td>${student_no}</td>
                        </tr>
                        <tr>
                            <td><strong>Parent Name</strong></td>
                            <td>${parent_name}</td>
                        </tr>
                        <tr>
                            <td><strong>Parent Number</strong></td>
                            <td>${parent_no}</td>
                        </tr>
                        <tr>
                            <td><strong>Quota</strong></td>
                            <td>${quota ?? 'N/A'}</td>
                        </tr>
                        <tr>
                            <td><strong>Studies</strong></td>
                            <td>${studies ?? 'N/A'}</td>
                        </tr>
                        <tr>
                            <td><strong>Updated By</strong></td>
                            <td>${modifier}</td>
                        </tr>
                        <tr>
                            <td><strong>Updated Version</strong></td>
                            <td>${currentVersion + 1}</td>
                        </tr>
                    </table>
        
                    <h3 style="margin-top: 20px;">Updated Documents</h3>
                    ${Array.isArray(files) && files.length > 0 ? `
                        <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%; text-align: left;">
                            <tr style="background-color: #f2f2f2;">
                                <th>Document Name</th>
                                <th>Original</th>
                                <th>Photocopy</th>
                                <th>Count</th>
                            </tr>
                            ${files.map(file => `
                                <tr>
                                    <td>${file.name}</td>
                                    <td>${file.original ? 'Yes' : 'No'}</td>
                                    <td>${file.photocopy ? 'Yes' : 'No'}</td>
                                    <td>${file.count ?? 0}</td>
                                </tr>
                            `).join('')}
                        </table>
                    ` : '<p>No document updates.</p>'}
        
                    ${remark ? `<h3 style="margin-top: 20px;">Remarks</h3><p>${remark}</p>` : ''}
        
                    <p>If you have any concerns regarding these updates, please reach out to the administration.</p>
                    <p>Best Regards,<br>Admin Team</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);        

        await pool.query("COMMIT");
        return res.status(201).json({
            message: 'Student information updated successfully',
            version: currentVersion + 1
        });

    } catch (error) {
        await pool.query("ROLLBACK");
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const searchStudent = async (req, res) => {
    try {
        const { admission_no, locked } = req.params;

        if (!admission_no) {
            return res.status(400).json({ error: 'Admission number is required' });
        }

        let lock = null;
        if (locked === 'lock') {
            lock = true;
        } else if (locked === 'unlock') {
            lock = false;
        } else {
            return res.status(400).json({ error: 'Invalid lock status. Use "lock" or "unlock".' });
        }

        const studentQuery = `
            SELECT admission_no, version_count 
            FROM student 
            WHERE admission_no = $1 AND lock = $2
        `;
        const studentResult = await pool.query(studentQuery, [admission_no, lock]);

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const student = studentResult.rows[0];

        const studentInfoQuery = `
            SELECT name, email, department, student_no, parent_no, parent_name, studies, quota
            FROM student_info
            WHERE student = $1 
            ORDER BY version DESC 
            LIMIT 1
        `;
        const studentInfoResult = await pool.query(studentInfoQuery, [admission_no]);

        res.json({
            data: [{
                admission_no: student.admission_no,
                version: student.version_count,
                ...(studentInfoResult.rows.length > 0 ? studentInfoResult.rows[0] : { message: 'No student info found' })
            }]
        });

    } catch (error) {
        console.error('Error searching for student:', error.message, error.stack);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

export const downloadStudent = async (req, res) => {
    try {
        const studentsQuery = `
            SELECT s.admission_no, si.*
            FROM student s
            LEFT JOIN (
                SELECT DISTINCT ON (student) * 
                FROM student_info 
                ORDER BY student, version DESC
            ) si ON si.student = s.admission_no
            WHERE s.lock = true;
        `;

        const { rows: students } = await pool.query(studentsQuery);

        if (students.length === 0) {
            return res.status(404).json({ message: "No editable students found" });
        }

        res.status(200).json({ data: students });
    } catch (error) {
        console.error("Error fetching editable students:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
export const getPdf = async (req, res) => {
    try {
        const { admission_no, version } = req.params;
        const isPreview = req.query.preview === 'true';

        const studentQuery = 'SELECT admission_no, version_count FROM student WHERE admission_no = $1 AND version_count = $2';
        const studentResult = await pool.query(studentQuery, [admission_no, version]);

        if (!studentResult.rows || studentResult.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const studentBasic = studentResult.rows[0];

        const infoQuery = `
        SELECT name, department, parent_name, parent_no, email, student_no, quota, studies, username 
        FROM student_info 
        WHERE student = $1 AND version = $2`;
        const infoResult = await pool.query(infoQuery, [admission_no, version]);

        if (!infoResult.rows || infoResult.rows.length === 0) {
            return res.status(404).json({ message: 'Student information not found' });
        }

        const studentInfo = infoResult.rows[0];

        const versionQuery = `
        SELECT date FROM versions WHERE student = $1`;
        const versionResult = await pool.query(versionQuery, [admission_no]);

        if (!versionResult.rows || versionResult.rows.length === 0) {
            return res.status(404).json({ message: 'Version information not found' });
        }

        const date = versionResult.rows[0];

        const recordsQuery = `
        SELECT * FROM record 
        WHERE student = $1 AND ver = $2`;
        const recordsResult = await pool.query(recordsQuery, [admission_no, version]);

        const studentData = {
            ...studentBasic,
            ...studentInfo,
            date: date.date,
            records: recordsResult.rows || []
        };

        const doc = new PDFDocument({ margin: 50, bufferPages: true });

        res.setHeader('Content-Type', 'application/pdf');

        if (isPreview) {
            res.setHeader('Content-Disposition', 'inline');
        } else {
            res.setHeader('Content-Disposition', `attachment; filename=student_${admission_no}_v${version}.pdf`);
        }

        doc.pipe(res);

        generatePDF(doc, studentData);

        doc.end();

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

function generatePDF(doc, data) {

    const pageHeight = doc.page.height;
    const contentPerPage = pageHeight - 100;


    const margin = 30;
    doc.fontSize(16).text('STUDENT RECORD', { align: 'center' });
    doc.moveDown(0.5);

    doc.fontSize(8)
        .text(`Version: ${data.version_count} | Date: ${new Date(data.date).toLocaleDateString()} | Generated: ${new Date().toLocaleString()}`, { align: 'right' });
    doc.moveDown(0.5);

    doc.fontSize(12).text('Student Information', { underline: true });
    doc.moveDown(0.5);

    const infoTable = {
        'Admission No': data.admission_no,
        'Name': data.name,
        'Department': data.department,
        'Studies': data.studies,
        'Student Phone': data.student_no,
        'Email': data.email,
        'Parent Name': data.parent_name,
        'Parent Phone': data.parent_no,
        'Quota': data.quota === 'MQ' ? 'Management Quota' : 'Government Quota',
        'Created By': data.username
    };

    const itemsPerColumn = Math.ceil(Object.keys(infoTable).length / 3);
    const column1Data = Object.entries(infoTable).slice(0, itemsPerColumn);
    const column2Data = Object.entries(infoTable).slice(itemsPerColumn, itemsPerColumn * 2);
    const column3Data = Object.entries(infoTable).slice(itemsPerColumn * 2);

    const column1X = margin;
    const column2X = 210;
    const column3X = 400;
    const startY = doc.y;
    let maxY = startY;

    doc.fontSize(9);
    column1Data.forEach(([key, value]) => {
        doc.text(`${key}: `, column1X, doc.y, { continued: true, bold: true })
            .text(`${value || 'N/A'}`);
        doc.moveDown(0.3);
        maxY = Math.max(maxY, doc.y);
    });

    doc.y = startY;

    column2Data.forEach(([key, value]) => {
        doc.text(`${key}: `, column2X, doc.y, { continued: true, bold: true })
            .text(`${value || 'N/A'}`);
        doc.moveDown(0.3);
        maxY = Math.max(maxY, doc.y);
    });

    doc.y = startY;

    column3Data.forEach(([key, value]) => {
        doc.text(`${key}: `, column3X, doc.y, { continued: true, bold: true })
            .text(`${value || 'N/A'}`);
        doc.moveDown(0.3);
        maxY = Math.max(maxY, doc.y);
    });

    doc.y = Math.max(doc.y, maxY);
    doc.moveDown(0.5);

    if (data.records && data.records.length > 0) {
        doc.fontSize(12).text('Document Records', { underline: true, align: 'center' });
        doc.moveDown(0.3);

        const colWidths = [30, 300, 60, 60, 50]; 

        const tableY = doc.y;
        const headerHeight = drawTableHeader(doc, tableY, ['S.No', 'Document', 'Original', 'Photocopy', 'Count'], colWidths);

        let currentY = headerHeight;
        data.records.forEach((record, index) => {
            const rowData = [
                (index + 1).toString(),
                record.document || record.name,
                record.original ? 'Yes' : 'No',
                record.photocopy ? 'Yes' : 'No',
                record.photocopy ? (record.count || '1') : '-'
            ];

            doc.fontSize(8);
            currentY = drawTableRowWithBorders(doc, currentY, rowData, colWidths);

            if (currentY > 700 && index < data.records.length - 1) {
                 drawTableRowWithBorders = function (doc, y, data, widths) {
                    let xPos = margin;
                    const rowHeight = 15; 

                    const totalWidth = widths.reduce((sum, w) => sum + w, 0);

                    data.forEach((text, i) => {
                        let cellText = text.toString();
                        if (i === 1 && cellText.length > 40) {
                            cellText = cellText.substring(0, 37) + '...';
                        }

                        doc.fillColor('#000000')
                            .text(cellText, xPos + 2, y + 3, {
                                width: widths[i] - 4,
                                align: i === 0 ? 'center' : i === 1 ? 'left' : 'center',
                                lineBreak: false
                            });

                        doc.moveTo(xPos, y)
                            .lineTo(xPos, y + rowHeight)
                            .stroke();

                        xPos += widths[i];
                    });

                    doc.moveTo(xPos, y)
                        .lineTo(xPos, y + rowHeight)
                        .stroke();
                    doc.moveTo(margin, y + rowHeight)
                        .lineTo(xPos, y + rowHeight)
                        .stroke();

                    return y + rowHeight;
                };
            }
        });

        doc.y = currentY + 5;
    } else {
        doc.fontSize(9).text('No document records found.');
    }

    if (data.remark) {
        if (doc.y < 730) {
            doc.moveDown(0.3);
            doc.fontSize(12).text('Remarks', { underline: true });
            doc.moveDown(0.3);

            const availableHeight = 780 - doc.y;

            let remarkText = data.remark;
            if (remarkText.length > availableHeight / 3) { 
                remarkText = remarkText.substring(0, availableHeight / 3) + '...';
            }

            doc.fontSize(8).text(remarkText);
        }
    }
}

function drawTableHeader(doc, y, headers, widths) {
    let xPos = 30; 
    const rowHeight = 18; 

    
    const totalWidth = widths.reduce((sum, w) => sum + w, 0);

    doc.rect(xPos, y, totalWidth, rowHeight)
        .fillAndStroke('#e6e6e6', '#000000');

    doc.font('Helvetica-Bold').fontSize(9);
    headers.forEach((text, i) => {
        doc.fillColor('#000000')
            .text(text, xPos + 3, y + 5, {
                width: widths[i] - 6,
                align: i === 0 ? 'center' : i === 1 ? 'left' : 'center'
            });

        doc.moveTo(xPos, y)
            .lineTo(xPos, y + rowHeight)
            .stroke();

        xPos += widths[i];
    });

    doc.moveTo(xPos, y)
        .lineTo(xPos, y + rowHeight)
        .stroke();

    doc.moveTo(30, y)
        .lineTo(xPos, y)
        .stroke();
    doc.moveTo(30, y + rowHeight)
        .lineTo(xPos, y + rowHeight)
        .stroke();

    doc.font('Helvetica');

    return y + rowHeight;
}

function drawTableRowWithBorders(doc, y, data, widths) {
    let xPos = 30; 
    const rowHeight = 16; 

    
    const totalWidth = widths.reduce((sum, w) => sum + w, 0);

    const isEvenRow = Math.floor(y / rowHeight) % 2 === 0;
    doc.rect(xPos, y, totalWidth, rowHeight)
        .fillAndStroke(isEvenRow ? '#ffffff' : '#f9f9f9', '#cccccc');

    doc.fontSize(8); 
    data.forEach((text, i) => {
        let cellText = text.toString();
        if (i === 1 && cellText.length > 45) { 
            cellText = cellText.substring(0, 42) + '...';
        }

        doc.fillColor('#000000')
            .text(cellText, xPos + 3, y + 4, {
                width: widths[i] - 6,
                align: i === 0 ? 'center' : i === 1 ? 'left' : 'center',
                lineBreak: false
            });

        doc.strokeColor('#cccccc')
            .moveTo(xPos, y)
            .lineTo(xPos, y + rowHeight)
            .stroke();

        xPos += widths[i];
    });

    doc.moveTo(xPos, y)
        .lineTo(xPos, y + rowHeight)
        .stroke();

    doc.moveTo(30, y + rowHeight)
        .lineTo(xPos, y + rowHeight)
        .stroke();

    return y + rowHeight;
}

export const generateExcelReport = async (req, res) => {
    try {
        const { remarks, categories } = req.body;


        let query = `
            SELECT 
                s.admission_no, 
                s.version_count,
                si.name, 
                si.email, 
                si.department, 
                si.student_no, 
                si.parent_name, 
                si.parent_no, 
                si.quota,
                si.studies,  
                si.username,
                v.doc_version, 
                v.student_version,
                v.date as version_date,
                v.username as version_username
            FROM student s
            JOIN student_info si ON s.admission_no = si.student AND si.version = s.version_count  
            JOIN versions v ON s.admission_no = v.student AND v.version_count = s.version_count
            WHERE s.lock = true 
        `;

        const queryParams = [];
        let paramIndex = 1;

        if (categories) {
            query += ` AND si.studies = $${paramIndex}`;
            queryParams.push(categories);
            paramIndex++;
        }

        query += ` ORDER BY si.studies, s.admission_no`;

        const { rows: students } = await pool.query(query, queryParams);

        if (!students.length) {
            return res.status(404).json({ success: false, message: "No students found", data: [] });
        }

        const studentIds = students.map(s => s.admission_no);

        const documentQuery = `
            SELECT student, name, original, photocopy, count, date
            FROM record
            WHERE student = ANY($1)
            ORDER BY date DESC
        `;
        const { rows: documents } = await pool.query(documentQuery, [studentIds]);

        let remarksData = [];
        if (remarks === 'yes') {
            const remarksQuery = `
                SELECT student, username, remark
                FROM remarks
                WHERE student = ANY($1)
            `;
            const { rows: remarksResults } = await pool.query(remarksQuery, [studentIds]);
            remarksData = remarksResults;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Student Report');

        worksheet.properties.outlineProperties = {
            summaryBelow: false,
            summaryRight: false
        };

        let columns = [
            { header: 'Admission No', key: 'admission_no', width: 15 },
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Department', key: 'department', width: 15 },
            { header: 'Student Contact', key: 'student_no', width: 15 },
            { header: 'Parent Name', key: 'parent_name', width: 20 },
            { header: 'Parent Contact', key: 'parent_no', width: 15 },
            { header: 'Quota', key: 'quota', width: 10 },
            { header: 'Studies', key: 'studies', width: 10 },
            { header: 'Version Count', key: 'version_count', width: 15 },
            { header: 'Last Version Date', key: 'version_date', width: 15 },
            { header: 'Last Version By', key: 'version_username', width: 15 },
        ];

        const allUniqueDocTypes = [...new Set(documents.map(doc => doc.name))]; 

        const studentDocumentGroups = {};

        documents.forEach(doc => {
            const studentId = doc.student.toString();
            if (!studentDocumentGroups[studentId]) {
                studentDocumentGroups[studentId] = [];
            }
            studentDocumentGroups[studentId].push(doc);
        });

        allUniqueDocTypes.forEach(docName => {
            columns.push({ header: `${docName} - Original`, key: `${docName}_original`, width: 20 });
            columns.push({ header: `${docName} - Photocopy`, key: `${docName}_photocopy`, width: 20 });
        });

        if (remarks === 'yes') {
            columns.push({ header: 'Remarks', key: 'remarks', width: 30 });
        }

        worksheet.columns = columns;

        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD3D3D3' }
        };
        headerRow.commit();

        function createStudentRowData(student) {
            let rowData = {
                admission_no: student.admission_no,
                name: student.name,
                email: student.email,
                department: student.department,
                student_no: student.student_no,
                parent_name: student.parent_name,
                parent_no: student.parent_no,
                quota: student.quota,
                studies: student.studies,
                version_count: student.version_count,
                version_date: student.version_date ? new Date(student.version_date).toLocaleDateString() : '',
                version_username: student.version_username || '',
            };

            const studentId = student.admission_no.toString();
            const studentDocs = documents.filter(doc => doc.student.toString() === studentId);

            const studentDocTypes = [...new Set(studentDocs.map(doc => doc.name))];

            const latestDocsMap = new Map();
            const photocopyCounts = new Map();

            studentDocs.forEach(doc => {
                if (
                    !latestDocsMap.has(doc.name) ||
                    new Date(doc.date) > new Date(latestDocsMap.get(doc.name).date)
                ) {
                    latestDocsMap.set(doc.name, doc);
                }

                if (doc.photocopy) {
                    photocopyCounts.set(doc.name, (photocopyCounts.get(doc.name) || 0) + doc.count);
                }
            });

            allUniqueDocTypes.forEach(docName => {
                const hasDocType = studentDocTypes.includes(docName);

                if (hasDocType) {
                    const hasOriginal = studentDocs.some(d => d.name === docName && d.original);
                    rowData[`${docName}_original`] = hasOriginal ? 'Original Given' : 'Not Given the document';

                    const totalPhotocopyCount = photocopyCounts.get(docName) || 0;
                    rowData[`${docName}_photocopy`] = totalPhotocopyCount > 0 ? `Photocopy Given (${totalPhotocopyCount})` : 'Not Given';
                } else {
                    rowData[`${docName}_original`] = 'Not Applicable';
                    rowData[`${docName}_photocopy`] = 'Not Applicable';
                }
            });

            if (remarks === 'yes') {
                // Ensure remarksData is an array and filter out null/undefined values
                const studentRemarks = Array.isArray(remarksData) 
                    ? remarksData.filter(r => r && r.student && r.student.toString() === studentId.toString()) 
                    : [];
            
                // Check if studentRemarks contains valid remark values
                rowData.remarks = studentRemarks.length > 0 && studentRemarks.some(r => r.remark)
                    ? studentRemarks.map(r => r.remark || 'No remarks for this student').join(', ')
                    : 'No remarks for this student';
            }
            
            return rowData;
        }

        students.forEach(student => {
            const rowData = createStudentRowData(student);
            const dataRow = worksheet.addRow(rowData);

            dataRow.eachCell({ includeEmpty: true }, cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();

        if (buffer.length < 100) {
            throw new Error('Generated Excel file appears to be invalid (too small)');
        }

        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="student-report.xlsx"',
            'Content-Length': buffer.length
        });

        res.send(buffer);
    } catch (error) {
        console.error('Error generating Excel report:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating Excel report',
            error: error.message
        });
    }
};  