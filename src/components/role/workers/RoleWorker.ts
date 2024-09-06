import { AuthProducer, EventsByProducer } from '../../../configs/MQQTConfig';
import { getLogger } from '../../../utils';

const logger = getLogger('RoleWorker');

export type RoleEvents = (typeof EventsByProducer)[typeof AuthProducer]['role'];
const roleEvents = EventsByProducer[AuthProducer].role;

const handlerByEvent = {
  [roleEvents.CreatedEvent]: logger.info,
  [roleEvents.UpdatedEvent]: logger.info,
  [roleEvents.DeletedEvent]: logger.info,
};

const defaultEventHandler = (event: unknown, payload: unknown) =>
  logger.warn(`Received unknown event: ${event} payload: ${JSON.stringify(payload)}`);

export const handler = async (event: RoleEvents[keyof RoleEvents], payload: any) => {
  try {
    const eventHandler = handlerByEvent[event] || defaultEventHandler;
    eventHandler(event, payload);
  } catch (error) {
    logger.error(error);
  }
};
