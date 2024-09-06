import _ from 'lodash';

import { getLogger } from './Logger';

const REGISTER_TERMINATION_EVENT_LISTENERS = true; // import from app config
const logger = getLogger('Termination Handler');

const terminationSignals = {
  SIGHUP: 1,
  SIGINT: 2,
  SIGQUIT: 3,
  SIGFPE: 8,
  SIGALRM: 14,
  SIGTERM: 15,
};

let terminating = false;
let terminationError: Error | null = null;
const terminationCallbacks: Function[] = [];

const getExitCode = (signal: string) => 128 + _.get(terminationSignals, signal, 0);

const registerTerminationEventListeners = () => {
  Object.keys(terminationSignals).forEach((signal) => {
    process.on(signal, async () => {
      logger.info(`Received Signal: ${signal}`);

      terminating = true;
      const error = new Error(`Container Termination Due To Signal: ${signal}`);
      terminationError = error;
      const allCloseOperations = terminationCallbacks.map((callback) => callback(error));

      await Promise.all(allCloseOperations);
      logger.info('Termination Strategies executed succesfully');
      process.exit(getExitCode(signal));
    });
  });

  logger.debug('Listening to termination signals');
};

const init = () => {
  if (REGISTER_TERMINATION_EVENT_LISTENERS) registerTerminationEventListeners();

  process.on('KILL', () => logger.error('Unexpected SIGKILL signal received.'));
};

const registerTerminationCallBack = (callback: Function) => {
  if (!terminationCallbacks.find((cb) => callback === cb)) terminationCallbacks.push(callback);
  const unregister = () => {
    _.remove(terminationCallbacks, (registeredCallback) => registeredCallback === callback);
  };

  return unregister;
};

const isTerminating = () => terminating;

const getError = () => terminationError;

export default { init, registerTerminationCallBack, isTerminating, getError };
