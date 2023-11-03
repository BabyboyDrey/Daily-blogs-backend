const router = require('express').Router()
const User = require('../models/User')
const BlogPost = require('../models/BlogPost')
const bcrypt = require('bcrypt')

router.get('/all%users', async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json(err)
  }
})

router.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(12)
      req.body.password = await bcrypt.hash(req.body.password, salt)
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body
        },
        { new: true }
      )
      console.log(updatedUser)
      res.status(200).json(updatedUser)
    } catch (err) {
      res.status(500).json(err)
    }
  } else {
    res.status(401).json('You can not update this.')
  }
})

// router.delete('/:id', async (req, res) => {
//   if (req.body.userId === req.params.id) {
//     try {
//       const user = await User.findById(req.params.id)
//       try {
//         await BlogPost.deleteMany({ username: user.username })
//         await User.findByIdAndDelete(req.params.id)
//         res.status(200).json('User has been deleted')
//       } catch (err) {
//         res.status(500).json(err)
//       }
//     } catch {
//       res.status(404).json('User not found')
//     }
//   } else {
//     res.status(404).json('You can not delete this.')
//   }
// });

router.delete('/:id', async (req, res) => {
  const AV = req.body.userId === req.params.id
  console.log(AV)
  if (AV) {
    try {
      const user = await User.findById(req.params.id)
      console.log(user)
      const userPosts = BlogPost.find({ user })
      console.log(userPosts)
      try {
        if (userPosts) {
          await BlogPost.deleteMany({ username: user.username })
          await User.deleteOne({ username: user.username })
          res.status(200).json('User succesfully deleted')
        } else {
          const userDelete = await User.deleteOne({ username: user.username })
          console.log(userDelete)
          res.status(200).json('User succesfully deleted')
        }
      } catch {
        res.status(404).json('Cannot delete User')
      }
    } catch (err) {
      res.status(500).json(err)
      console.error(err)
    }
  } else {
    res.status(400).json('Can only delete your user credentials')
  }
})

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, ...others } = user._doc
    res.status(200).json(others)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
