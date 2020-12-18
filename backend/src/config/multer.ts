import multer, { StorageEngine } from 'multer';
import path from 'path';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 'disk',
  tmpFolder: string;
  uploadsFolder: string;
  config: {
    disk: {};
  };
  multer: {
    storage: StorageEngine;
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileName = `${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },

  config: {
    disk: {},
  },
} as IUploadConfig;
