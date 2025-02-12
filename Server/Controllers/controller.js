import pool from "../Config/db.js";

export const login = async(req,res) => {
    const {username, password} = req.body;
    if(!username || !password){
        return res.status(400).json({error: "Please enter both username and password."});
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

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal server error."});
    }
}