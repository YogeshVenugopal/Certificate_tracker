import pool from "../Config/db.js";
import XlsxPopulate from "xlsx-populate";

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
            'SELECT admission_no FROM "student" WHERE admission_no = $1',
            [admission_no]
        );

        if (checkStudent.rows.length > 0) {
            await pool.query("ROLLBACK");
            return res.status(400).json({ message: "Student already exists" });
        }


        console.log("Inserting into student table:", admission_no);
        await pool.query(
            'INSERT INTO "student" (admission_no, version_count, lock) VALUES ($1, $2, $3)',
            [admission_no, 0, false]
        );

        await pool.query(
            'INSERT INTO "versions" (student, version_count, student_version, doc_version, date) VALUES ($1, $2, $3, $4, NOW())',
            [admission_no, 0, 0, 0]
        );

        await pool.query(
            'INSERT INTO "remarks" (student, username) VALUES ($1, $2)',
            [admission_no, username]
        )
        await pool.query(
            'INSERT INTO "student_info" (name, student, email, department, student_no, parent_no, parent_name, quota, studies,version) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
            [name, admission_no, email, department, student_no, parent_no, parent_name, quota, studies, 0]
        );

        if (Array.isArray(files) && files.length > 0) {
            for (const file of files) {
                if (
                    !file.id ||
                    typeof file.name !== 'string' ||
                    typeof file.original !== 'boolean' ||
                    typeof file.photocopy !== 'boolean' ||
                    typeof file.count !== 'number'
                ) {
                    console.warn("Invalid file structure:", file);
                    continue;
                }


                await pool.query(
                    'INSERT INTO "record" (student, name, original, photocopy, count, ver, username, date) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())',
                    [admission_no, file.name, file.original, file.photocopy, file.count, 0, username]
                );

            }
        }

        await pool.query("COMMIT");
        return res.status(200).json({ message: "Student table values inserted successfully" });

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
        const students = await pool.query("SELECT si.*, s.admission_no FROM student_info si JOIN student s ON si.student = s.admission_no WHERE s.lock = false; ")
        if (students.rows.length === 0) {
            return res.status(400).json({ message: "Document not found" });
        }

        res.status(200).json({ data: students.rows });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

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
        const studentVersion = student.version_count;

        // Get student details - modified to include version matching
        const studentInfoQuery = `
            SELECT name, email, department, student_no, parent_no, quota, version, studies, parent_name
            FROM student_info
            WHERE student = $1
        `;
        const studentInfoResult = await pool.query(studentInfoQuery, [admission_no]);

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
    const { name, email, department, parent_name, quota, locked, studies, files, username, remark } = req.body;
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

        if (![name, email, department, parent_name, student_no, parent_no, quota, studies, username].every(val => val !== undefined)) {
            await pool.query("ROLLBACK");
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!Array.isArray(files)) {
            await pool.query("ROLLBACK");
            return res.status(400).json({ error: 'Invalid files format' });
        }

        // Check if student exists and get current version
        const studentRes = await pool.query(
            "SELECT version_count, lock FROM student WHERE admission_no = $1",
            [admission_no]
        );

        if (studentRes.rows.length === 0) {
            await pool.query("ROLLBACK");
            return res.status(400).json({ error: 'Student not found' });
        }

        // Implement optimistic concurrency control
        const currentVersion = studentRes.rows[0].version_count;
        if (version !== undefined && version !== currentVersion) {
            await pool.query("ROLLBACK");
            return res.status(409).json({ error: 'Version conflict. Please refresh and try again.' });
        }

        // Update lock status
        let { lock } = studentRes.rows[0];
        lock = locked !== undefined ? locked : lock;
        console.log("Locked value: ", lock);

        // Update student record in a single operation
        await pool.query(
            "UPDATE student SET version_count = version_count + 1, lock = $1 WHERE admission_no = $2",
            [lock, admission_no]
        );

        // Update student info
        const studentInfoResult = await pool.query(
            `UPDATE student_info 
             SET name = $1, email = $2, department = $3, student_no = $4, 
                 parent_no = $5, parent_name = $6, quota = $7, studies = $8, version = version + 1 
             WHERE student = $9 RETURNING *`,
            [name, email, department, student_no, parent_no, parent_name, quota, studies, admission_no]
        );

        if (studentInfoResult.rowCount === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({ error: 'Student info not found' });
        }

        // Handle files
        for (const file of files) {
            const { name, original, photocopy, count } = file;

            // Check if any required file fields are missing
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
                `INSERT INTO record (name, original, photocopy, count, ver, student, username, date) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
                [name, original, photocopy, count, nextVer, admission_no, username]
            );
        }

        // Handle optional remark
        if (remark !== undefined) {
            const remarkResult = await pool.query(
                `SELECT * FROM remarks WHERE student = $1`,
                [admission_no]
            );

            if (remarkResult.rowCount > 0) {
                // If remark exists, update it
                await pool.query(
                    `UPDATE remarks SET remark = $1, username = $2 WHERE student = $3`,
                    [remark, username, admission_no]
                );
            } else {
                // If no remark exists, insert a new one
                await pool.query(
                    `INSERT INTO remarks (student, remark, username) 
                    VALUES ($1, $2, $3)`,
                    [admission_no, remark, username]
                );
            }
        }

        // Update versions table
        const versionResult = await pool.query(
            `UPDATE versions 
             SET version_count = version_count + 1, doc_version = doc_version + 1 
             WHERE student = $1 RETURNING *`,
            [admission_no]
        );

        if (versionResult.rowCount === 0) {
            // Insert if not exists
            await pool.query(
                `INSERT INTO versions (student, version_count, doc_version)
                 VALUES ($1, 1, 1)`,
                [admission_no]
            );
        }

        await pool.query("COMMIT");
        res.status(200).json({
            message: "Student data updated successfully",
            lock,
            version: currentVersion + 1
        });
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error updating student data:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}


export const downloadStudent = async (req, res) => {
    try {
        const students = await pool.query("SELECT si.*, s.admission_no FROM student_info si JOIN student s ON si.student = s.admission_no WHERE s.lock = true; ")
        if (students.rows.length === 0) {
            return res.status(400).json({ message: "Document not found" });
        }

        res.status(200).json({ data: students.rows });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

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

export const downloadStudentXL = async (req, res) => {
    try {
        const { admission_no } = req.params;

        if (!admission_no) {
            return res.status(400).json({ error: "Admission number is required" });
        }

        const studentQuery = `SELECT * FROM student_info WHERE student = $1`;
        const studentResult = await pool.query(studentQuery, [admission_no]);

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ error: "Student not found" });
        }

        const recordQuery = `SELECT * FROM record WHERE student = $1`;
        const recordResult = await pool.query(recordQuery, [admission_no]);

        const studentData = {
            studentInfo: studentResult.rows[0], // Single student data
            records: recordResult.rows, // List of records
        };

        const workbook = await XlsxPopulate.fromBlankAsync();
        const summarySheet = workbook.sheet(0);
        summarySheet.name("Summary");

        // Header Styling
        const headerStyle = {
            bold: true,
            fill: { type: "solid", color: "D3D3D3" },
            border: { top: "thin", bottom: "thin", left: "thin", right: "thin" },
            horizontalAlignment: "center",
        };

        // Student Details Section
        summarySheet.cell("A1").value("Student Details").style({ bold: true, fontSize: 14 });

        summarySheet.cell("A3").value("Name:");
        summarySheet.cell("B3").value(studentData.studentInfo.name).style({ bold: true });

        summarySheet.cell("A4").value("Admission Number:");
        summarySheet.cell("B4").value(studentData.studentInfo.student).style({ bold: true });

        summarySheet.cell("A5").value("Email:");
        summarySheet.cell("B5").value(studentData.studentInfo.email);

        summarySheet.cell("A6").value("Department:");
        summarySheet.cell("B6").value(studentData.studentInfo.department);

        summarySheet.cell("A7").value("Phone:");
        summarySheet.cell("B7").value(studentData.studentInfo.student_no);

        summarySheet.cell("A8").value("Parent Name:");
        summarySheet.cell("B8").value(studentData.studentInfo.parent_name);

        summarySheet.cell("A9").value("Parent Phone:");
        summarySheet.cell("B9").value(studentData.studentInfo.parent_no);

        summarySheet.cell("A10").value("Quota:");
        summarySheet.cell("B10").value(studentData.studentInfo.quota);

        // Document Status Header
        summarySheet.cell("A12").value("Document Status").style({ bold: true, underline: true });

        // Table Headers for Documents
        const headers = ["Document Name", "Original", "Photocopy", "Count", "Submitted By"];
        headers.forEach((header, index) => {
            const cell = summarySheet.cell(14, index + 1);
            cell.value(header).style(headerStyle);
        });

        // Add document status data
        studentData.records.forEach((record, index) => {
            const row = index + 15;
            summarySheet.cell(row, 1).value(record.name);
            summarySheet.cell(row, 2).value(record.original ? "Yes" : "No");
            summarySheet.cell(row, 3).value(record.photocopy ? "Yes" : "No");
            summarySheet.cell(row, 4).value(record.count);
            summarySheet.cell(row, 5).value(record.username);

            // Apply border to all cells in the row
            for (let col = 1; col <= headers.length; col++) {
                summarySheet.cell(row, col).style({
                    border: { top: "thin", bottom: "thin", left: "thin", right: "thin" },
                });
            }
        });

        // Set column widths
        summarySheet.column("A").width(40);
        summarySheet.column("B").width(15);
        summarySheet.column("C").width(15);
        summarySheet.column("D").width(10);
        summarySheet.column("E").width(20);

        // Save the workbook
        const filePath = "student_summary.xlsx";
        await workbook.toFileAsync(filePath);
        console.log("Excel file generated successfully:", filePath);

        return res.status(200).json({ message: "Excel file generated successfully", filePath });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
