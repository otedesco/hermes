import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
const environment = process.env;

export const MQQT_PROVIDER = environment.MQQT_PROVIDER;
export const MQTT_HOST_MICROSERVICES = environment.MQTT_HOST_MICROSERVICES || 'localhost:9092';
export const PREFIX = environment.PREFIX || 'hermes';
export const CONSUME_EVENTS = environment.CONSUME_EVENTS === 'true' || false;
export const WORKERS_MAX_BYTES_PER_PARTITION = environment.WORKERS_MAX_BYTES_PER_PARTITION
  ? +environment.WORKERS_MAX_BYTES_PER_PARTITION
  : undefined;
export const commitIntervalSeconds = 3;
export const CONSUMER_TOPIC_PREFIX = environment.CONSUMER_TOPIC_PREFIX || 'apart-re';

const clientConfig = { host: MQTT_HOST_MICROSERVICES };

export const CONSUMER_CONFIG = clientConfig;

export const AuthProducer = 'cerberus';

export const Producers = [AuthProducer] as const;

const Actions = {
  CREATED: 'added',
  UPDATED: 'updated',
  DELETED: 'deleted',
  RECOVERY: 'recovery',
  INVITE: 'invite',
} as const;

export const ComponentsByProducer = {
  [AuthProducer]: {
    ACCOUNT: 'account',
    PROFILE: 'profile',
    ORGANIZATION: 'organization',
    ROLE: 'role',
  },
} as const;

const AuthComponents = ComponentsByProducer[AuthProducer];

export const TopicsByProducer = {
  [AuthProducer]: {
    account: `${AuthProducer}_${AuthComponents.ACCOUNT}_topic`,
    profile: `${AuthProducer}_${AuthComponents.PROFILE}_topic`,
    organization: `${AuthProducer}_${AuthComponents.ORGANIZATION}_topic`,
    role: `${AuthProducer}_${AuthComponents.ROLE}_topic`,
  },
} as const;

export const EventsByProducer = {
  [AuthProducer]: {
    [AuthComponents.ACCOUNT]: {
      CreatedEvent: `${AuthProducer}_${AuthComponents.ACCOUNT}_${Actions.CREATED}`,
      UpdatedEvent: `${AuthProducer}_${AuthComponents.ACCOUNT}_${Actions.UPDATED}`,
      DeletedEvent: `${AuthProducer}_${AuthComponents.ACCOUNT}_${Actions.DELETED}`,
      RecoveryEvent: `${AuthProducer}_${AuthComponents.ACCOUNT}_${Actions.RECOVERY}`,
      InviteEvent: `${AuthProducer}_${AuthComponents.ACCOUNT}_${Actions.INVITE}`,
    },
    [AuthComponents.ORGANIZATION]: {
      CreatedEvent: `${AuthProducer}_${AuthComponents.ORGANIZATION}_${Actions.CREATED}`,
      UpdatedEvent: `${AuthProducer}_${AuthComponents.ORGANIZATION}_${Actions.UPDATED}`,
      DeletedEvent: `${AuthProducer}_${AuthComponents.ORGANIZATION}_${Actions.DELETED}`,
      InviteEvent: `${AuthProducer}_${AuthComponents.ORGANIZATION}_${Actions.INVITE}`,
    },
    [AuthComponents.PROFILE]: {
      CreatedEvent: `${AuthProducer}_${AuthComponents.PROFILE}_${Actions.CREATED}`,
      UpdatedEvent: `${AuthProducer}_${AuthComponents.PROFILE}_${Actions.UPDATED}`,
      DeletedEvent: `${AuthProducer}_${AuthComponents.PROFILE}_${Actions.DELETED}`,
    },
    [AuthComponents.ROLE]: {
      CreatedEvent: `${AuthProducer}_${AuthComponents.ROLE}_${Actions.CREATED}`,
      UpdatedEvent: `${AuthProducer}_${AuthComponents.ROLE}_${Actions.UPDATED}`,
      DeletedEvent: `${AuthProducer}_${AuthComponents.ROLE}_${Actions.DELETED}`,
    },
  },
} as const;
