require('dotenv').config();

import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';

import express from 'express';
import cors from 'cors';

import './database';

import routes from './routes';
import uploadConfig from './config/multer';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/files', express.static(uploadConfig.tmpFolder));

app.listen(3335, () => {
  console.log('🚀 Server started on port 3335');
});
