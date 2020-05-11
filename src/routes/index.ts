import { Router, Request, Response } from 'express';
const router = Router();

router.get('/', (req: Request, res: Response, next) => {
  res.render('index');
});

export default router;
