import { AuthProducer, EventsByProducer } from '../../../configs/MQQTConfig';
import { getLogger } from '../../../utils';

const logger = getLogger('ProfileWorker');

export type ProfileEvents = (typeof EventsByProducer)[typeof AuthProducer]['profile'];
const profileEvents = EventsByProducer[AuthProducer].profile;

const handlerByEvent = {
  [profileEvents.CreatedEvent]: logger.info,
  [profileEvents.UpdatedEvent]: logger.info,
  [profileEvents.DeletedEvent]: logger.info,
};

const defaultEventHandler = (event: unknown, payload: unknown) =>
  logger.warn(`Received unknown event: ${event} payload: ${JSON.stringify(payload)}`);

export const handler = async (event: ProfileEvents[keyof ProfileEvents], payload: any) => {
  try {
    const eventHandler = handlerByEvent[event] || defaultEventHandler;
    eventHandler(event, payload);
  } catch (error) {
    logger.error(error);
  }
};
