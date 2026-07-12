const pool = require("../config/db");
const bcrypt = require("bcrypt");

// ==========================
// LOGIN
// ==========================
const login = async (req, res) => {
    try {
        const { employee_id, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE employee_id = $1",
            [employee_id]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            user: {
                id: user.id,
                full_name: user.full_name,
                employee_id: user.employee_id,
                department: user.department,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ==========================
// REGISTER
// ==========================
const register = async (req, res) => {
    try {

        const {
            full_name,
            employee_id,
            department,
            email,
            password,
            confirm_password,
        } = req.body;

        // Check empty fields
        if (
            !full_name ||
            !employee_id ||
            !department ||
            !email ||
            !password ||
            !confirm_password
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check password match
        if (password !== confirm_password) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        // Check duplicate Employee ID
        const employeeExists = await pool.query(
            "SELECT * FROM users WHERE employee_id = $1",
            [employee_id]
        );

        if (employeeExists.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Employee ID already exists"
            });
        }

        // Check duplicate Email
        const emailExists = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (emailExists.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert User
        await pool.query(
            `INSERT INTO users
            (full_name, employee_id, department, email, password_hash)
            VALUES ($1, $2, $3, $4, $5)`,
            [
                full_name,
                employee_id,
                department,
                email,
                hashedPassword
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Account created successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

module.exports = {
    login,
    register
};