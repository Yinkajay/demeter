const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.NODE_ENV === 'development' ? process.env.LOCAL_DATABASE_URL : process.env.REMOTE_DATABASE_URL
})

pool.connect()
  .then(client => {
    if(process.env.NODE_ENV === 'development'){
      console.log('✅ Connected to the LOCAL database successfully')
    }else{
      console.log('✅ Connected to the REMOTE database successfully')
    }
    client.release()
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.stack)
  })



module.exports = pool