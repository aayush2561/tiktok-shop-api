import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import db from '../config/db.js';

import AuthRoute from './routes/AuthRoutes.js';
import UserRoute from './routes/UserRoutes.js';
import ProductRoute from './routes/ProductRoutes.js';

const app = express();
const port = 3000;

db();
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', AuthRoute);
app.use('/api/v1/user', UserRoute);
app.use('/api/v1/product',ProductRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
