import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define the storage configuration for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './public/uploads';
        // Check if the directory exists, if not, create it
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).toLowerCase();
        cb(null, `${name.replaceAll(" ", "-")}-${uniqueSuffix}${ext}`);
    }
});

// Define the file filter to validate file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']; // Specify allowed MIME types
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG, GIF, and PDF files are allowed!'), false); // Reject the file
    }
};

// Create the multer instance with storage and file filter
export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Set file size limit (5 MB in this case)
    },
    fileFilter,
});