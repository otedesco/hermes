import { EventsByProducer, AuthProducer } from '../../../configs/MQQTConfig';
import { getLogger } from '../../../utils';

const logger = getLogger('OrganizationWorker');

export type OrganizationEvents = (typeof EventsByProducer)[typeof AuthProducer]['organization'];
const organizationEvents = EventsByProducer[AuthProducer].organization;
const handlerByEvent = {
  [organizationEvents.CreatedEvent]: logger.info,
  [organizationEvents.UpdatedEvent]: logger.info,
  [organizationEvents.DeletedEvent]: logger.info,
  [organizationEvents.InviteEvent]: logger.info,
};

const defaultEventHandler = (event: unknown, payload: unknown) =>
  logger.warn(`Received unknown event: ${event} payload: ${JSON.stringify(payload)}`);

export const handler = async (
  event: OrganizationEvents[keyof OrganizationEvents],
  payload: any,
) => {
  try {
    const eventHandler = handlerByEvent[event] || defaultEventHandler;
    eventHandler(event, payload);
  } catch (error) {
    logger.error(error);
  }
};
