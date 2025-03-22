import pool from "../Config/db.js";
import XlsxPopulate from "xlsx-populate";
import PDFDocument from "pdfkit";

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Please enter both username and password." });
    }

    try {
        const userQuery = "SELECT * FROM users WHERE username = $1";
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

    const { quota, admission_no, name, email, department, student_no, parent_name, parent_no, files, studies, username } = postData;

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
            'INSERT INTO "versions" (student, version_count, student_version, doc_version, username, date) VALUES ($1, $2, $3, $4, $5, NOW())',
            [admission_no, 0, 0, 0, username]
        );

        await pool.query(
            'INSERT INTO "remarks" (student, username) VALUES ($1, $2)',
            [admission_no, username]
        );


        const quotaValue = quota ?? null;
        const studiesValue = studies ?? null;

        await pool.query(
            'INSERT INTO "student_info" (name, student, email, department, student_no, parent_no, parent_name, quota, studies, username, version, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())',
            [name, admission_no, email, department, student_no, parent_no, parent_name, quotaValue, studiesValue, username, 0]
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
                    'INSERT INTO "record" (student, name, original, photocopy, count, ver, date) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
                    [admission_no, file.name, originalValue, photocopyValue, countValue, 0]
                );
            }
        }

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

        // Validate each parameter separately
        if (!admission_no) {
            return res.status(400).json({ error: 'Admission number is required' });
        }

        if (!version) {
            return res.status(400).json({ error: 'Version is required' });
        }

        // Get student basic info
        const studentQuery = `SELECT admission_no, version_count FROM student WHERE admission_no = $1`;
        const studentResult = await pool.query(studentQuery, [admission_no]);

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const student = studentResult.rows[0];

        // Get student details - modified to include version matching
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

        // Get record files
        const recordQuery = `
            SELECT name, original, photocopy, count, ver
            FROM record
            WHERE student = $1 AND ver = $2
        `;
        const recordResult = await pool.query(recordQuery, [admission_no, version]);
        const files = recordResult.rows;

        // Get remarks
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
    const version = parseInt(req.body.version, 10);
    const parent_no = parseInt(req.body.parent_no, 10);
    const student_no = parseInt(req.body.student_no, 10);

    try {
        await pool.query("BEGIN");

        // Validate required fields
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

        // Fetch existing student data
        const studentRes = await pool.query(
            "SELECT version_count, lock FROM student WHERE admission_no = $1",
            [admission_no]
        );

        if (studentRes.rows.length === 0) {
            await pool.query("ROLLBACK");
            return res.status(400).json({ error: 'Student not found' });
        }

        // Get the current version of the student
        const currentVersion = studentRes.rows[0].version_count;


        // Fetch latest student_info record for comparison
        const studentInfoRes = await pool.query(
            `SELECT name, email, department, student_no, parent_no, parent_name, quota, studies, username
             FROM student_info WHERE student = $1 ORDER BY version DESC LIMIT 1`,
            [admission_no]
        );

        // Initialize change tracking variables
        let hasStudentInfoChanges = false;
        let hasFileChanges = false;
        let hasRemarkChanges = false;
        let anyChangesDetected = false;

        // Check for student info changes
        if (studentInfoRes.rowCount > 0) {
            const existingInfo = studentInfoRes.rows[0];

            // Strict comparison for each field
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
            // No existing record found, so it's a new record
            hasStudentInfoChanges = true;
        }

        // Check for file changes
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

            // Create maps for easier comparison
            const existingFilesMap = {};
            existingFiles.forEach(file => {
                existingFilesMap[file.name] = {
                    original: file.original,
                    photocopy: file.photocopy,
                    count: file.count
                };
            });

            // Check each file for changes
            for (const file of files) {
                const existingFile = existingFilesMap[file.name];

                if (!existingFile) {
                    // New file
                    hasFileChanges = true;
                    break;
                }



                // Convert to string/number for consistent comparison
                if (
                    String(existingFile.original || '') !== String(file.original || '') ||
                    String(existingFile.photocopy || '') !== String(file.photocopy || '') ||
                    Number(existingFile.count || 0) !== Number(file.count || 0)
                ) {
                    hasFileChanges = true;
                    break;
                }
            }

            // Also check if any existing files were removed
            if (!hasFileChanges) {
                const existingNames = Object.keys(existingFilesMap);
                const newNames = files.map(file => file.name);
                if (existingNames.some(name => !newNames.includes(name))) {
                    hasFileChanges = true;
                }
            }

        }

        // Check for remark changes
        if (remark !== undefined) {
            const remarkResult = await pool.query(
                `SELECT remark FROM remarks WHERE student = $1`,
                [admission_no]
            );

            if (remarkResult.rowCount > 0) {
                hasRemarkChanges = String(remarkResult.rows[0].remark || '') !== String(remark || '');
            } else if (remark && remark.trim() !== '') {
                // New remark when there wasn't one before
                hasRemarkChanges = true;
            }
        }


        // Determine if any changes were detected
        anyChangesDetected = hasStudentInfoChanges || hasFileChanges || hasRemarkChanges || locked;
        // If no changes detected in ANY data, return early WITHOUT updating anything
        if (!anyChangesDetected) {
            await pool.query("COMMIT");
            return res.status(200).json({
                message: 'No changes detected, database update skipped',
                version: currentVersion
            });
        }


        // Since changes were detected, increment the version
        let { lock } = studentRes.rows[0];
        lock = locked !== undefined ? locked : lock;


        // Increment version count only ONCE regardless of what changed
        await pool.query(
            "UPDATE student SET version_count = version_count + 1, lock = $1 WHERE admission_no = $2",
            [lock, admission_no]
        );

        // Insert new student_info ONLY if student info changed
        await pool.query(
            `INSERT INTO student_info (student, name, email, department, student_no, parent_no, parent_name, quota, studies, version, username, date) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())`,
            [admission_no, name, email, department, student_no, parent_no, parent_name, quota, studies, currentVersion + 1, modifier]
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
                    VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
                [name, original, photocopy, count, nextVer, admission_no]
            );
        }

        await pool.query(`
            UPDATE versions SET version_count = $1, doc_version = $1, student_version = $1 WHERE student = $2
        `, [currentVersion + 1, admission_no]);


        // Handle optional remark ONLY if there are remark changes

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

        // Validate required fields
        if (!admission_no) {
            return res.status(400).json({ error: 'Admission number is required' });
        }

        // Validate locked parameter
        let lock = null;
        if (locked === 'lock') {
            lock = true;
        } else if (locked === 'unlock') {
            lock = false;
        } else {
            return res.status(400).json({ error: 'Invalid lock status. Use "lock" or "unlock".' });
        }

        // Query the student table for basic info
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
        const latestVersion = student.version_count;

        // Query the student_info table for detailed information
        const studentInfoQuery = `
            SELECT name, email, department, student_no, parent_no, parent_name, studies, quota
            FROM student_info
            WHERE student = $1 
            ORDER BY version DESC 
            LIMIT 1
        `;
        const studentInfoResult = await pool.query(studentInfoQuery, [admission_no]);
        // Combine and return the results
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

// export const downloadStudentXL = async (req, res) => {
//     try {
//         const { admission_no } = req.params;
//         if (!admission_no) {
//             return res.status(400).json({ error: "Admission number is required" });
//         }

//         const studentQuery = `SELECT * FROM student_info WHERE student = $1`;
//         const studentResult = await pool.query(studentQuery, [admission_no]);

//         let version = studentResult.rows.length > 0 ? studentResult.rows[0].version : null;

//         if (studentResult.rows.length === 0) {
//             return res.status(404).json({ error: "Student not found" });
//         }

//         const recordQuery = `SELECT * FROM record WHERE student = $1 AND ver = $2`;
//         const recordResult = await pool.query(recordQuery, [admission_no, version]);

//         const studentData = {
//             studentInfo: studentResult.rows[0], // Single student data
//             records: recordResult.rows, // List of records
//         };

//         // Path to your template file - adjust this path to match your directory structure
//         const templatePath = '../Server/files/template.xlsx';


//         // Load the template file
//         const workbook = await XlsxPopulate.fromFileAsync(templatePath);
//         const summarySheet = workbook.sheet("Sheet1");


//         if (!summarySheet) {
//             throw new Error("Could not find the first sheet in the template");
//         }


//         // Fill student details from the template
//         summarySheet.cell("C5").value(studentData.studentInfo.name);
//         summarySheet.cell("C6").value(studentData.studentInfo.student);
//         summarySheet.cell("C7").value(studentData.studentInfo.email);
//         summarySheet.cell("C9").value(studentData.studentInfo.department);
//         summarySheet.cell("C8").value(studentData.studentInfo.student_no);
//         summarySheet.cell("C10").value(studentData.studentInfo.parent_name);
//         summarySheet.cell("C11").value(studentData.studentInfo.parent_no);
//         summarySheet.cell("C12").value(studentData.studentInfo.quota);
//         summarySheet.cell("C13").value(studentData.studentInfo.studies);

//         // Start row for document records (adjust based on your template)
//         const startRow = 17;

//         // Add document status data
//         studentData.records.forEach((record, index) => {
//             const row = index + startRow;
//             summarySheet.cell(row, 1).value(record.name);
//             summarySheet.cell(row, 2).value(record.original ? "Yes" : "No");
//             summarySheet.cell(row, 3).value(record.photocopy ? "Yes" : "No");
//             summarySheet.cell(row, 4).value(record.count);
//             summarySheet.cell(row, 5).value(record.username);
//         });


//         // Generate a user-friendly filename
//         const filename = `student_${admission_no}_summary.xlsx`;

//         // Set response headers for file download
//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         res.setHeader('Content-Disposition', `attachment; filename=${filename}`);


//         // Send the workbook directly to the response
//         const buffer = await workbook.outputAsync();
//         return res.send(buffer);

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };


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
        // Add a query parameter to determine if it's a preview or download
        const isPreview = req.query.preview === 'true';

        // 1. Fetch student basic info from student table
        const studentQuery = 'SELECT admission_no, version_count FROM student WHERE admission_no = $1 AND version_count = $2';
        const studentResult = await pool.query(studentQuery, [admission_no, version]);

        if (!studentResult.rows || studentResult.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const studentBasic = studentResult.rows[0];

        // 2. Fetch detailed student info from student_info table
        const infoQuery = `
        SELECT name, department, parent_name, parent_no, email, student_no, quota, studies, username 
        FROM student_info 
        WHERE student = $1 AND version = $2`;
        const infoResult = await pool.query(infoQuery, [admission_no, version]);

        if (!infoResult.rows || infoResult.rows.length === 0) {
            return res.status(404).json({ message: 'Student information not found' });
        }

        const studentInfo = infoResult.rows[0];

        // 3. Fetch version date information
        const versionQuery = `
        SELECT date FROM versions WHERE student = $1`;
        const versionResult = await pool.query(versionQuery, [admission_no]);

        if (!versionResult.rows || versionResult.rows.length === 0) {
            return res.status(404).json({ message: 'Version information not found' });
        }

        const date = versionResult.rows[0];


        // 4. Fetch records from the record table based on student and version
        const recordsQuery = `
        SELECT * FROM record 
        WHERE student = $1 AND ver = $2`;
        const recordsResult = await pool.query(recordsQuery, [admission_no, version]);

        // Combine all data
        const studentData = {
            ...studentBasic,
            ...studentInfo,
            date: date.date,
            records: recordsResult.rows || []
        };

        // Generate PDF
        const doc = new PDFDocument({ margin: 50, bufferPages: true });
        
        // Set response headers based on whether this is a preview or download
        res.setHeader('Content-Type', 'application/pdf');
        
        if (isPreview) {
            // For preview, set inline disposition
            res.setHeader('Content-Disposition', 'inline');
        } else {
            // For download, set attachment disposition
            res.setHeader('Content-Disposition', `attachment; filename=student_${admission_no}_v${version}.pdf`);
        }

        // Pipe the PDF to the response
        doc.pipe(res);

        // Create PDF content
        generatePDF(doc, studentData);
        
        // End the document which triggers the response
        doc.end();

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
/**
 * Function to generate PDF with proper formatting
 * @param {PDFDocument} doc - PDF document instance
 * @param {Object} data - Student data
 */
function generatePDF(doc, data) {
    // Set document to have exactly 1 page
    const pageHeight = doc.page.height;
    const contentPerPage = pageHeight - 100; // Subtract margins

    // Reduce margin and spacing to fit more content
    const margin = 30;

    // Add title with smaller font
    doc.fontSize(16).text('STUDENT RECORD', { align: 'center' });
    doc.moveDown(0.5);

    // Add version information in a more compact format
    doc.fontSize(8)
        .text(`Version: ${data.version_count} | Date: ${new Date(data.date).toLocaleDateString()} | Generated: ${new Date().toLocaleString()}`, { align: 'right' });
    doc.moveDown(0.5);

    // Basic information section with smaller header
    doc.fontSize(12).text('Student Information', { underline: true });
    doc.moveDown(0.5);

    // Create a three-column layout for student information
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

    // Split the data into three columns
    const itemsPerColumn = Math.ceil(Object.keys(infoTable).length / 3);
    const column1Data = Object.entries(infoTable).slice(0, itemsPerColumn);
    const column2Data = Object.entries(infoTable).slice(itemsPerColumn, itemsPerColumn * 2);
    const column3Data = Object.entries(infoTable).slice(itemsPerColumn * 2);

    // Set positions for columns
    const column1X = margin;
    const column2X = 210;
    const column3X = 400;
    const startY = doc.y;
    let maxY = startY;

    // Add column 1 data
    doc.fontSize(9);
    column1Data.forEach(([key, value]) => {
        doc.text(`${key}: `, column1X, doc.y, { continued: true, bold: true })
            .text(`${value || 'N/A'}`);
        doc.moveDown(0.3);
        maxY = Math.max(maxY, doc.y);
    });

    // Reset y-position for column 2
    doc.y = startY;

    // Add column 2 data
    column2Data.forEach(([key, value]) => {
        doc.text(`${key}: `, column2X, doc.y, { continued: true, bold: true })
            .text(`${value || 'N/A'}`);
        doc.moveDown(0.3);
        maxY = Math.max(maxY, doc.y);
    });

    // Reset y-position for column 3
    doc.y = startY;

    // Add column 3 data
    column3Data.forEach(([key, value]) => {
        doc.text(`${key}: `, column3X, doc.y, { continued: true, bold: true })
            .text(`${value || 'N/A'}`);
        doc.moveDown(0.3);
        maxY = Math.max(maxY, doc.y);
    });

    // Set y-position to the lowest point after all columns
    doc.y = Math.max(doc.y, maxY);
    doc.moveDown(0.5);

    // Document Records section with smaller header and more compact design
    if (data.records && data.records.length > 0) {
        doc.fontSize(12).text('Document Records', { underline: true, align: 'center' });
        doc.moveDown(0.3);

        // Optimize table column widths for better fit
        const colWidths = [30, 300, 60, 60, 50]; // Adjusted widths

        // Draw optimized table header
        const tableY = doc.y;
        const headerHeight = drawTableHeader(doc, tableY, ['S.No', 'Document', 'Original', 'Photocopy', 'Count'], colWidths);

        // Table rows with compact styling
        let currentY = headerHeight;
        data.records.forEach((record, index) => {
            const rowData = [
                (index + 1).toString(),
                record.document || record.name,
                record.original ? 'Yes' : 'No',
                record.photocopy ? 'Yes' : 'No',
                record.photocopy ? (record.count || '1') : '-'
            ];

            // Use smaller font to fit more rows
            doc.fontSize(8);
            currentY = drawTableRowWithBorders(doc, currentY, rowData, colWidths);

            // If we're getting too close to the bottom of the page, compress further
            if (currentY > 700 && index < data.records.length - 1) {
                // Reduce row height for remaining items
                drawTableRowWithBorders = function (doc, y, data, widths) {
                    let xPos = margin;
                    const rowHeight = 15; // Even smaller row height

                    // Calculate total width
                    const totalWidth = widths.reduce((sum, w) => sum + w, 0);

                    // Draw the cell texts with minimal spacing
                    data.forEach((text, i) => {
                        // Truncate text if too long to fit cell
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

                        // Draw minimal column separator
                        doc.moveTo(xPos, y)
                            .lineTo(xPos, y + rowHeight)
                            .stroke();

                        xPos += widths[i];
                    });

                    // Draw outer borders
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

    // Add remarks in a more compact format if available
    if (data.remark) {
        // Only add remarks if we have enough space
        if (doc.y < 730) {
            doc.moveDown(0.3);
            doc.fontSize(12).text('Remarks', { underline: true });
            doc.moveDown(0.3);

            // Calculate available height for remarks
            const availableHeight = 780 - doc.y;

            // Truncate remarks if necessary
            let remarkText = data.remark;
            if (remarkText.length > availableHeight / 3) { // Rough estimate of characters that might fit
                remarkText = remarkText.substring(0, availableHeight / 3) + '...';
            }

            doc.fontSize(8).text(remarkText);
        }
    }
}

/**
 * Optimized header drawing function
 */
function drawTableHeader(doc, y, headers, widths) {
    let xPos = 30; // Use smaller margin
    const rowHeight = 18; // Reduced height

    // Calculate total width
    const totalWidth = widths.reduce((sum, w) => sum + w, 0);

    // Draw background for header
    doc.rect(xPos, y, totalWidth, rowHeight)
        .fillAndStroke('#e6e6e6', '#000000');

    // Draw the header texts with smaller font
    doc.font('Helvetica-Bold').fontSize(9);
    headers.forEach((text, i) => {
        doc.fillColor('#000000')
            .text(text, xPos + 3, y + 5, {
                width: widths[i] - 6,
                align: i === 0 ? 'center' : i === 1 ? 'left' : 'center'
            });

        // Draw vertical line for column
        doc.moveTo(xPos, y)
            .lineTo(xPos, y + rowHeight)
            .stroke();

        xPos += widths[i];
    });

    // Draw the final vertical line
    doc.moveTo(xPos, y)
        .lineTo(xPos, y + rowHeight)
        .stroke();

    // Draw horizontal lines for top and bottom
    doc.moveTo(30, y)
        .lineTo(xPos, y)
        .stroke();
    doc.moveTo(30, y + rowHeight)
        .lineTo(xPos, y + rowHeight)
        .stroke();

    doc.font('Helvetica');

    return y + rowHeight;
}

/**
 * Optimized row drawing function
 */
function drawTableRowWithBorders(doc, y, data, widths) {
    let xPos = 30; // Use smaller margin
    const rowHeight = 16; // Reduced height

    // Calculate total width
    const totalWidth = widths.reduce((sum, w) => sum + w, 0);

    // Draw row background (lighter alternating colors to maintain readability)
    const isEvenRow = Math.floor(y / rowHeight) % 2 === 0;
    doc.rect(xPos, y, totalWidth, rowHeight)
        .fillAndStroke(isEvenRow ? '#ffffff' : '#f9f9f9', '#cccccc');

    // Draw the cell texts
    doc.fontSize(8); // Smaller font for better fit
    data.forEach((text, i) => {
        // Truncate text if too long to fit cell
        let cellText = text.toString();
        if (i === 1 && cellText.length > 45) { // Document name column
            cellText = cellText.substring(0, 42) + '...';
        }

        doc.fillColor('#000000')
            .text(cellText, xPos + 3, y + 4, {
                width: widths[i] - 6,
                align: i === 0 ? 'center' : i === 1 ? 'left' : 'center',
                lineBreak: false
            });

        // Draw vertical line for column (lighter stroke)
        doc.strokeColor('#cccccc')
            .moveTo(xPos, y)
            .lineTo(xPos, y + rowHeight)
            .stroke();

        xPos += widths[i];
    });

    // Draw the final vertical line
    doc.moveTo(xPos, y)
        .lineTo(xPos, y + rowHeight)
        .stroke();

    // Draw horizontal line for bottom (only)
    doc.moveTo(30, y + rowHeight)
        .lineTo(xPos, y + rowHeight)
        .stroke();

    return y + rowHeight;
}