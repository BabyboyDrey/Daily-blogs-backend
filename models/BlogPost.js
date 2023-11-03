const mongoose = require('mongoose')

const BlogPostSchema = new mongoose.Schema(
  {
    img: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    comments: [
      {
        user: {
          type: Object
        },
        comment: { type: String },
        createdAt: {
          type: Date,
          default: Date.now()
        }
      }
    ]
  },

  {
    timestamps: true
  }
)

module.exports = mongoose.model('BlogPost', BlogPostSchema)
