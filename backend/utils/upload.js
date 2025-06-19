const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
cloudinary,
params:{
    folder:'courses',
    resource_type:'video',
    format:'mp4',
    public_id:(req,file)=>`${Date.now()}-${file.originalname}`
}
})

const upload = multer({storage});

module.exports = upload;
