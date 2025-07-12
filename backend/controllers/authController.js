const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const pool = require('../db')

const signup = async (req, res) => {
    const { username, email, password } = req.body
    try {
        if (!username || !email || !password) {
            res.status(400).json({ message: 'Make sure you fill in your email, password and username' })
        }

        // Check if email exists in db
        const queryStr = `SELECT email FROM users where email=$1`
        const values = [email]
        const duplicateEmail = await pool.query(queryStr, values)

        if (duplicateEmail.rowCount > 0) {
            console.log('somethings is wrong-------------------------------------------------------')
            return res.status(409).json({ error: 'User already exists' })
        }

        // hash password before storing in db
        const hashedPw = await bcrypt.hash(password, 10)

        const dbQueryStr = 'INSERT INTO users (username, email,  userPassword) values ($1, $2, $3) RETURNING id'
        const dbValues = [username, email, hashedPw]

        const addUser = await pool.query(dbQueryStr, dbValues)


        const token = jwt.sign(
            {
                id: addUser.rows[0].id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        )

        res.status(201).json({ message: 'User signup successful' })
    } catch (error) {
        console.error('Signup failed:', error.stack);
        res.status(500).json({ error })
    }
}

const login = (req, res) => {
    try {

    } catch (error) {

    }
}




module.exports = { signup } 