import pool from "../Middlewares/db.js"

export const login = async(req,res)=>{
    const { username, password } = req.body
    console.log(username,password);
    try {
        
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        const userData = result.rows[0];
    
        if(!userData){
            return res.status(404).json({ message: "User not found" });
        }
        if(userData.password !== password){
            return res.status(401).json({ message: "Invalid password" });
        }
        res.status(200).json({ 
            message: "Login successful", 
            username: userData.username 
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

 export const getColumnValues = async (req, res) => {
    const { columnName } = req.params;

    try {
        const validColumns = [
            'ug_plain_gq', 'ug_gq_fg', 'ug_mq', 'lateral_plain_gq', 'lateral_gq_fg',
            'lateral_mq', 'pg_mba_mq', 'pg_mba_gq', 'pg_me_gq', 'pg_me_mq', 'pg_me_dp_gq', 'pg_me_dp_mq'
        ];

        if (!validColumns.includes(columnName)) {
            return res.status(400).json({ message: 'Invalid column name' });
        }
        const query = `SELECT id, ${columnName} FROM documents`;
        const result = await pool.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(`Error fetching values for column ${columnName}:`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createStudents = async (req, res) => {
    try {
        const {
            name,
            admission_number,
            parent_name,
            department,
            quota,
            studies,
            email,
            parent_no,
            student_no,
            first_graduate,
            diploma,
            files
        } = req.body;

        // Validate required fields
        if (!name || !admission_number || !parent_name || !department || !quota || !studies || !email || !parent_no || !student_no) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const filesJson = JSON.stringify(files);
        const query = `
            INSERT INTO students (
                name, admission_number, parent_name, department, quota, studies, 
                email, parent_no, student_no, first_graduate, diploma, files
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
            RETURNING *;
        `;
        
        const values = [
            name,
            admission_number,
            parent_name,
            department,
            quota,
            studies,
            email,
            parent_no,
            student_no,
            first_graduate,
            diploma,
            filesJson
        ];

        const { rows } = await pool.query(query, values);
        res.status(201).json({ message: 'Student created successfully', student: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
