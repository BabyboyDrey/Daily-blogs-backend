const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, path.join(__dirname, './images'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.floor(Math.random() * 1e9)
    const filename = file.originalname.split('.')[0]
    cb(null, filename + '-' + uniqueSuffix + '.jpg')
  }
})

const upload = multer({ storage: storage })

module.exports = {
  upload
}
