import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../spa')));

app.use('/', indexRouter);

import add from './routes/add.js'
app.use('/api/add', add);
import policyholders from './routes/policyholders.js' 
app.use('/api/policyholders', policyholders);


export default app;
