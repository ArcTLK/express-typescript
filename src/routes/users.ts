import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import atob from 'atob';
import User from '../models/user';
const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  // check if provided with authorization header
  if (!req.headers.authorization) {
    return res.status(400).json('No authorization header present.');
  }
  // check if authorization is basic
  const [authType, authData] = req.headers.authorization.split(' ');
  if (authType !== 'Basic') return res.sendStatus(400);
  // decode base64 authData
  const data = atob(authData);
  // extract email and password
  const [email, password] = data.split(':');
  // get user from db
  const user = await User.findOne({ email });
  // user does not exist or password does not match
  if (user === null || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json('The Email / Password is incorrect.');
  }
  // send jwt token
  res.json(jwt.sign({
    sub: user._id.toString(),
    aud: process.env.JWT_AUDIENCE,
    alg: 'HS256'
  }, process.env.JWT_SECRET));
});

router.post('/register', async (req: Request, res: Response) => {
  // check if email address already exists
  if (await User.exists({ email: req.body.email })) {
    return res.status(400).json('This email address is already taken.');
  }
  // create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10)
  });
  // send jwt token
  res.json(jwt.sign({
    sub: user._id.toString(),
    aud: process.env.JWT_AUDIENCE,
    alg: 'HS256'
  }, process.env.JWT_SECRET));
});

router.post('/test', async (req: Request, res: Response) => {
  res.json('Works');
});

export default router;
