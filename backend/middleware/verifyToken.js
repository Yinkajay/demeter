const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    console.log(req)
    const header = req.headers['authorization']

    if (!header || !header.startsWith('Bearer')) {
        return res.status(401).json({ error: 'No token provided' })
    }

    const token = header.split(' ')[1]

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedToken
        next()
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' })
    }

}

module.exports = verifyToken 