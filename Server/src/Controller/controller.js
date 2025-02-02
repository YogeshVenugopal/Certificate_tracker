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
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}