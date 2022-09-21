import multer from "multer";
import path from "path";
import { ROOT_DIR, UPLOAD_FOLDER_CONFIG } from "./constants.config";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./${UPLOAD_FOLDER_CONFIG.DIRNAME}`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

export default upload;
