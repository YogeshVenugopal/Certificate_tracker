import pool from "../Config/db.js";

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
        typeof postData.parent_no !== 'number'
    ) {
        return res.status(400).json({ message: "Missing or invalid required fields." });
    }

    const { quota, admission_no, name, email, department, student_no, parent_no, files, studies } = postData;


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
            'INSERT INTO "student_info" (name, student, email, department, student_no, parent_no, quota, studies,version) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [name, admission_no, email, department, student_no, parent_no, quota, studies, 0]
        );

        if (Array.isArray(files)) {
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
                    'INSERT INTO "record" (student, name, original, photocopy, count, ver, date) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
                    [admission_no, file.name, file.original, file.photocopy, file.count, 0]
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
        const { admission_no } = req.params; 

        if (!admission_no) {
            return res.status(400).json({ error: 'Admission number is required' });
        }

        const studentQuery = `SELECT admission_no, version_count FROM student WHERE admission_no = $1`;
        const studentResult = await pool.query(studentQuery, [admission_no]);

        if (studentResult.rows.length === 0) {
            return res.status(400).json({ error: 'Student not found' });
        }

        const student = studentResult.rows[0]; 
        const studentVersion = student.version_count;


        const studentInfoQuery = `
            SELECT name, email, department, student_no, parent_no, quota, version, studies
            FROM student_info
            WHERE student = $1
        `;
        const studentInfoResult = await pool.query(studentInfoQuery, [admission_no]);

        if (studentInfoResult.rows.length === 0) {
            return res.status(400).json({ error: 'Student info not found' });
        }

        const studentInfo = studentInfoResult.rows[0];

      
        const recordQuery = `
            SELECT name, original, photocopy, count
            FROM record
            WHERE student = $1 AND ver = $2
        `;
        const recordResult = await pool.query(recordQuery, [admission_no, studentVersion]);

        const files = recordResult.rows;

      
        res.json({
            admission_no: student.admission_no,
            ...studentInfo,
            files
        });

    } catch (error) {
        console.error('Error fetching student details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}