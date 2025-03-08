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
    // console.log(postData);

    // Validate required fields
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

    const { quota, admission_no, name, email, department, student_no, parent_no, files } = postData;


    try {
        await pool.query("BEGIN"); // Start transaction

        // Check if student already exists
        const checkStudent = await pool.query(
            'SELECT admission_no FROM "student" WHERE admission_no = $1',
            [admission_no]
        );

        if (checkStudent.rows.length > 0) {
            await pool.query("ROLLBACK");
            return res.status(400).json({ message: "Student already exists" });
        }

        // Insert student
        console.log("Inserting into student table:", admission_no);
        await pool.query(
            'INSERT INTO "student" (admission_no, version_count, lock) VALUES ($1, $2, $3)',
            [admission_no, 0, false]
        );

        // Insert into versions
        await pool.query(
            'INSERT INTO "versions" (student, version_count, student_version, doc_version, date) VALUES ($1, $2, $3, $4, NOW())',
            [admission_no, 0, 0, 0]
        );

        // Insert into student_info
        await pool.query(
            'INSERT INTO "student_info" (name, student, email, department, student_no, parent_no, quota, version) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [name, admission_no, email, department, student_no, parent_no, quota, 0]
        );

        // Insert documents (skip empty ones)
        if (Array.isArray(files)) {
            for (const file of files) {
                if (
                    !file.id ||
                    typeof file.original !== 'boolean' ||
                    typeof file.photocopy !== 'boolean' ||
                    typeof file.count !== 'number'
                ) {
                    console.warn("Invalid file structure:", file);
                    continue;
                }

                if (!file.original && !file.photocopy && file.count === 0) continue;

                await pool.query(
                    'INSERT INTO "record" (student, original, photocopy, count, ver, date) VALUES ($1, $2, $3, $4, $5, NOW())',
                    [admission_no, file.original, file.photocopy, file.count, 0]
                );
            }
        }

        await pool.query("COMMIT"); // Commit transaction
        return res.status(200).json({ message: "Student table values inserted successfully" });

    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error inserting student records:", error); // Log full error object
        return res.status(500).json({ error: error.message || "Failed to create student records" });

    }   
};