import { AppFactory, ConfigOptions, LoggerFactory } from '@otedesco/server-utils';

import { EventsRoute } from './components/HTTPServerRouter';
import { SERVER_PORT } from './configs/AppConfig';
import { handleError, logError } from './middlewares/ErrroHandlerMiddleware';

const { logger } = LoggerFactory.getInstance(__filename);

const privateRoutes = [new EventsRoute()];

const serverConfig: ConfigOptions = {
  routes: [{ version: '/v1', routes: privateRoutes }],
  logger,
  port: SERVER_PORT,
};

class NotificationsServer extends AppFactory {
  initializeErrorHandling(): void {
    logger.info('Initializing error handlers middlewares');
    this.app.use(logError);
    this.app.use(handleError);
    logger.info('Error handlers middlewares initialized');
  }

  public async init() {
    this.listen();
  }
}

export default new NotificationsServer(serverConfig);
