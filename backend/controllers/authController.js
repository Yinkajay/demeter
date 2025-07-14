const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const pool = require('../db')

const signup = async (req, res) => {
    const { username, email, password } = req.body
    console.log(req.body)
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Make sure you fill in your email, password and username' })
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

        const dbQueryStr = 'INSERT INTO users (username, email,  userPassword) values ($1, $2, $3) RETURNING id, username, email'
        const dbValues = [username, email, hashedPw]

        const addUser = await pool.query(dbQueryStr, dbValues)
        const userInfo = addUser.rows[0]

        const token = jwt.sign(
            {
                id: addUser.rows[0].id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        )

        res.status(201).json({ status: 'success', message: 'User signup successful', user: { id: userInfo.id, username: userInfo.username, email: userInfo.email }, token })
    } catch (error) {
        console.error('Signup failed:', error.stack);
        res.status(500).json({ error })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body

    try {
        // find user with email
        const findUserQuery = 'SELECT * FROM users where LOWER(email) = $1'
        const values = [email.toLowerCase()]

        const findUser = await pool.query(findUserQuery, values)
        console.log(findUser)

        if (findUser.rowCount == 0) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const userInfo = findUser.rows[0]
        console.log(userInfo)

        // compare db password to received password
        const compare = await bcrypt.compare(password, userInfo.userpassword)
        console.log(compare)

        if (!compare) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const token = jwt.sign(
            { id: userInfo.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        return res.status(200).json({ status: 'success', message: 'Login successful', user: { id: userInfo.id, username: userInfo.username, email: userInfo.email }, token })
    } catch (error) {
        console.error('Login failed', error.stack)
        res.status(500).json({ error })
    }
}

const getProfileData = async (req, res) => {
    const userId = req.user.id

    const getUserQuery = 'SELECT bio,email,profile_image_url,username  FROM users where id = $1'
    const values = [userId]

    try {
        const user = await pool.query(getUserQuery, values)
        const userData = user.rows[0]

        res.status(200).json({ status: 'success', data: userData })
    } catch (error) {
        console.error('Fetch failed', error.stack)
        res.status(500).json({ error })
    }
}

const editProfileData = async (req, res) => {
    const userId = req.user.id
    const fieldUpdate = req.body

    const fieldTochange = Object.keys(fieldUpdate)[0]
    const newValue = Object.values(fieldUpdate)[0]

    const allowedFields = ['email', 'username', 'bio', 'profile_image_url']

    if (!allowedFields.includes(fieldTochange)) {
        throw new Error('Invalid field')
    }
    try {
        const editDataQuery = `UPDATE users SET ${fieldTochange} = $1 WHERE id = $2 RETURNING *`
        const values = [`${newValue}`, userId]

        const request = await pool.query(editDataQuery, values)
        console.log(request)
        const user = request.rows[0]

        res.status(200).json({ status: 'success', data: user })
    } catch (error) {
        console.error('Update failed', error.stack)
        res.status(500).json({ error })
    }
}



module.exports = { signup, login, getProfileData, editProfileData } 