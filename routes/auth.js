const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

router.post('/sign-up', async (req, res) => {
  const userEmail = await User.findOne({ email: req.body.email })
  try {
    if (userEmail === req.body.email) {
      return res.status(400).json('User already exists')
    } else {
      const salt = await bcrypt.genSalt(12)
      const hashedPass = await bcrypt.hash(req.body.password, salt)
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPass
      })

      const user = await newUser.save()
      res.status(200).json(user)
    }0
  } catch (err) {
    res.status(500).json(err)
  }
})

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      res.status(400).json('Invalid email or password')
    } else {
      const validated = await bcrypt.compare(req.body.password, user.password)
      if (!validated) {
        res.status(400).json('Invalid email or password')
      } else {
        const { password, ...others } = user._doc
        res.status(200).json(others)
      }
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
