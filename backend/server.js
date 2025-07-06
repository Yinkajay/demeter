const express = require('express')
const cors = require("cors")
const recipeRoutes = require('./routes/recipeRoutes')
require('dotenv').config()


const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/recipes', recipeRoutes)

app.get('/', (req,res)=>{
    res.send('Recipe api is live')
})

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
}) 