import fs from 'fs';
import multer, { diskStorage } from 'multer';
import path from 'path';

export const TMP_UPLOAD_DIR = path.join(__dirname, 'tmp', 'uploads');

if (!fs.existsSync(TMP_UPLOAD_DIR)) {
    fs.mkdirSync(TMP_UPLOAD_DIR, { recursive: true });
}

export default multer({
    storage: diskStorage({
        destination: function (_req: any, _file: any, cb: (arg0: null, arg1: string) => void) {
            cb(null, TMP_UPLOAD_DIR);
        },
        filename: function (_req: any, file: { fieldname: string }, cb: (arg0: null, arg1: string) => void) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix);
        }
    })
});