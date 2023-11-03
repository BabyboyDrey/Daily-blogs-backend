const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
const blogPostRoute = require('./routes/blogPost')
const userRoute = require('./routes/user')

const cors = require('cors')

require('dotenv').config({ path: '.env' })

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://daily-blogs-izg8.onrender.com'],
    credentials: true
  })
)
app.use(express.json())
app.use('/images', express.static('images'))

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log('connected to mongodb'))
  .catch(err => {
    console.log(err)
  })

app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/post', blogPostRoute)

app.get('/', (req, res) => {
  res.send('Backend functional!')
})

app.listen(8080, () => {
  console.log('port is functional on port 8080')
})
