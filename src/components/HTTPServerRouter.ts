import { LoggerFactory, Route } from '@otedesco/server-utils';
import { Request, Response } from 'express';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { handler as accountHandler } from './accounts/workers/AccountWorker';
import { handler as organizationHandler } from './organization/workers/OrganizationWorker';
import { handler as profileHandler } from './profile/workers/ProfileWorker';
import { handler as roleHandler } from './role/workers/RoleWorker';

const { logger } = LoggerFactory.getInstance(__filename);

const handlers = {
  account: accountHandler,
  organization: organizationHandler,
  profile: profileHandler,
  role: roleHandler,
};

type Event<T, K> = {
  timestamp: number;
  name: K;
  payload: T;
  metadata: Record<string, unknown>;
};

const mapEventToHandler = ([event]: Event<unknown, string>[]):
  | ((name: string, payload: unknown) => Promise<void>)
  | undefined => {
  const [, component] = event.name.split('_');
  if (!(component in handlers)) {
    throw new Error('Handler not found for the given event component');
  }

  return handlers[component as keyof typeof handlers];
};

const Controller = async ({ body }: Request, res: Response) => {
  if (!Array.isArray(body) || body.length === 0) {
    res.status(400).send('Invalid request body');
  }
  const handler = mapEventToHandler(body);
  if (!handler) {
    res.status(400).send('Invalid event');

    return;
  }
  const { name, payload } = body[0] as Event<unknown, string>;

  logger.info('Processing event', name);
  await handler(name, payload);

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
