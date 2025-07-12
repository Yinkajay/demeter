const express = require('express')
const cors = require("cors")
const recipeRoutes = require('./routes/recipeRoutes')
const authRoutes = require('./routes/authRoutes')
const morgan = require('morgan')
require('dotenv').config()


const app = express()
app.use(cors())
app.use(express.json())

console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use('uploads', express.static('uploads'))
app.use('/api/recipes', recipeRoutes)
app.use('/api/auth', authRoutes)

app.get('/', (req,res)=>{
    res.send('Recipe api is live')
})


const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
}) 