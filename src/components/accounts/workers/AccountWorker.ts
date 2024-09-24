import { EventsByProducer, AuthProducer } from '../../../configs/MQQTConfig';
import { getLogger } from '../../../utils';
import {
  createHandler,
  deleteHandler,
  recoveryHandler,
  updateHandler,
  inviteHandler,
} from '../services/AccountService';
const logger = getLogger('AccountWorker');

export type AccountEvents = (typeof EventsByProducer)[typeof AuthProducer]['account'];

const accountEvents = EventsByProducer[AuthProducer].account;

export const handlerByEvent = {
  [accountEvents.CreatedEvent]: createHandler,
  [accountEvents.UpdatedEvent]: updateHandler,
  [accountEvents.DeletedEvent]: deleteHandler,
  [accountEvents.RecoveryEvent]: recoveryHandler,
  [accountEvents.InviteEvent]: inviteHandler,
};

const defaultEventHandler = (event: unknown, payload: unknown) =>
  logger.warn(`Received unknown event: ${event} payload: ${JSON.stringify(payload)}`);

export const handler = async (event: AccountEvents[keyof AccountEvents], payload: any) => {
  logger.info(event, payload);
  try {
    const eventHandler = handlerByEvent[event] || defaultEventHandler;
    await eventHandler(event, payload);
  } catch (error) {
    logger.error(error);
  }
};
