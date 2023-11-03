const router = require('express').Router()
const BlogPost = require('../models/BlogPost')
const path = require('path')
const { upload } = require('../multer')

router.get('/allPosts', async (req, res) => {
  try {
    const post = await BlogPost.find()
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(400).json('No Posts made yet')
    }
  } catch (err) {
    res.status(500).json(err)
    console.log('err in allPosts:', err)
  }
})

router.get('/category-linked-books', async (req, res) => {
  try {
    const categoryBooks = await BlogPost.aggregate([
      {
        $group: {
          _id: '$category',
          books: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          category: '$_id',
          books: 1
        }
      }
    ])
      .option({ maxTimeMS: 50000 })
      .exec()

    res.status(200).json(categoryBooks)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

router.post('/createPost', upload.single('file'), async (req, res) => {
  const newPost = new BlogPost(req.body)

  const fileName = req.file.filename
  const fileUrl = path.join(fileName)
  newPost.img = fileUrl
  console.log(`np`, newPost)

  try {
    const savedPost = await newPost.save().maxTimeMS(50000)
    console.log(`sp`, savedPost)
    res.status(200).json(savedPost)
  } catch (err) {
    res.status(500).json(err)
  }
})

router.put('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
    if (post.username === req.body.username) {
      try {
        const updatedPost = await BlogPost.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body
          },
          { new: true }
        )
        res.status(200).json(updatedPost)
      } catch (err) {
        res.status(500).json(err)
      }
    } else {
      res.status(401).json('Can not update other people post')
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
    if (post.username === req.body.username) {
      try {
        await post.deleteOne()
        res.status(200).json('Post Deleted')
      } catch (err) {
        res.status(500).json(err)
      }
    } else {
      res.status(401).json('You can only delete your posts')
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(400).json('Post does not exist')
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get('/user/:user', async (req, res) => {
  const username = req.params.user
  console.log('Username:', username)
  try {
    if (username) {
      const posts = await BlogPost.find({ username: username })
      console.log('Posts:', posts)
      res.status(200).json(posts)
    } else {
      console.log('Invalid request')
      res.status(400).json('Invalid request')
    }
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
})

router.post('/create-comment', async (req, res) => {
  try {
    const newComment = req.body
    const foundPost = await BlogPost.findOne({
      _id: newComment.blogPostId.toString()
    }).maxTimeMS(50000)

    if (!foundPost) {
      return res.status(404).json('Post not found')
    }

    foundPost.comments.push({
      user: newComment.user,
      comment: newComment.comment
    })

    foundPost.save()
    console.log(`comment:`, foundPost.comments)
    res.status(200).json(foundPost)
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get('/get-post-comments/:postId', async (req, res) => {
  try {
    const foundPost = await BlogPost.findOne({
      _id: req.params.postId
    }).maxTimeMS(50000)

    if (!foundPost) {
      return res.status(404).json('Post not found')
    }

    const sortedComments = foundPost.comments.sort((a, b) => {
      return b.createdAt - a.createdAt
    })

    res.status(200).json(sortedComments)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
