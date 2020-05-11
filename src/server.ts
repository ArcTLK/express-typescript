import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { connection, connect } from 'mongoose';
import jwt from 'express-jwt';

// initialize environment variables
dotenv.config();

const app = express();

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// allow CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization');
  next();
});

// if OPTIONS, return 200 response
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  }
  else {
    next();
  }
});

// intercept jwt keys
app.use(jwt({
  secret: process.env.JWT_SECRET,
  audience: process.env.JWT_AUDIENCE
}).unless({
  path: [
    { url: '/users/register', methods: ['POST'] },
    { url: '/users/login', methods: ['POST'] },
    { url: '/', methods: ['GET'] }
  ]
}));

import indexRouter from './routes/index';
import usersRouter from './routes/users';

app.use('/', indexRouter);
app.use('/users', usersRouter);

// create connection event handlers
connection
  .on('error', console.log)
  .on('disconnected', () => {
    // reconnect to mongodb
    connect(process.env.DB_URI, {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  })
  .once('open', () => {
    app.listen(process.env.SERVER_PORT, () => {
      console.log('App is listening on port 3000!');
    });
  });

// connect to mongodb
connect(process.env.DB_URI, {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
