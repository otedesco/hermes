import { LoggerFactory, Route } from '@otedesco/server-utils';
import { Request, Response } from 'express';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

const { logger } = LoggerFactory.getInstance(__filename);

const Controller = (req: Request, res: Response) => {
  logger.info('Incoming request', req.body);
  console.log(req.body);
  res.status(200).send('OK');
};

export class EventsRoute implements Route {
  public path: string;

  public router: Router;

  constructor() {
    this.path = '/events';
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, asyncHandler(Controller));
  }
}
