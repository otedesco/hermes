import { Consumer, ConsumerConfig } from '@otedesco/notify';
import { config } from 'dotenv';
import _ from 'lodash';

import { AccountWorker, OrganizationWorker, ProfileWorker, RoleWorker } from '../components';

import { APP_NAME } from './AppConfig';
import {
  CONSUMER_CONFIG,
  WORKERS_MAX_BYTES_PER_PARTITION,
  Producers,
  TopicsByProducer,
} from './MQQTConfig';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
const environment = process.env;

const ACCOUNT_HANDLER = 'account-handler';
const PROFILE_HANDLER = 'profile-handler';
const ORGANIZATION_HANDLER = 'organization-handler';
const ROLE_HANDLER = 'role-handler';

export const handlersByName = {
  [ACCOUNT_HANDLER]: AccountWorker.handler,
  [PROFILE_HANDLER]: ProfileWorker.handler,
  [ORGANIZATION_HANDLER]: OrganizationWorker.handler,
  [ROLE_HANDLER]: RoleWorker.handler,
} as const;

// TODO: Every worker must handle one business vertical. i.e: "hermes-wrks-account" group should
//       Be renamed to hermes-wrks-auth and it should handle all events related to Authentication and Authorization (cerberus service)
//       this will keeped as is just for example porpuses (and only cerberus service is running now)

export const WorkersConfig: ConsumerConfig[] = Producers.map((producer) => {
  return {
    ...CONSUMER_CONFIG,
    groupId: `${APP_NAME}-workers-${producer}`,
    maxBytesPerPartition: WORKERS_MAX_BYTES_PER_PARTITION,
    active: _.get(environment, `${producer.toUpperCase()}_WORKER_CONSUME_EVENTS`) === 'true',
    topics: Object.entries(TopicsByProducer[producer]).map(([component, topic]) => ({
      active: true,
      concurrency: 4,
      handlerName: `${component}-handler`,
      name: Consumer.internalTopicPrefix(topic),
    })),
  };
});

// export const WorkersConfig: ConsumerConfig[] = [
//   {
//     ...CONSUMER_CONFIG,
//     groupId: 'hermes-wrks-account',
//     maxBytesPerPartition: WORKERS_MAX_BYTES_PER_PARTITION,
//     active: environment.ACCOUNT_WORKER_CONSUME_EVENTS === 'true',
//     topics: [
//       {
//         active: true,
//         concurrency: 4,
//         handlerName: ACCOUNT_HANDLER,
//         name: Consumer.internalTopicPrefix(Topics.Account),
//       },
//     ],
//   },
//   {
//     ...CONSUMER_CONFIG,
//     groupId: 'hermes-wrks-profile',
//     maxBytesPerPartition: WORKERS_MAX_BYTES_PER_PARTITION,
//     active: environment.PROFILE_WORKER_CONSUME_EVENTS === 'true',
//     topics: [
//       {
//         active: true,
//         concurrency: 4,
//         handlerName: PROFILE_HANDLER,
//         name: Consumer.internalTopicPrefix(Topics.Profile),
//       },
//     ],
//   },
//   {
//     ...CONSUMER_CONFIG,
//     groupId: 'hermes-wrks-organization',
//     maxBytesPerPartition: WORKERS_MAX_BYTES_PER_PARTITION,
//     active: environment.ORGANIZATION_WORKER_CONSUME_EVENTS === 'true',
//     topics: [
//       {
//         active: true,
//         concurrency: 4,
//         handlerName: ORGANIZATION_HANDLER,
//         name: Consumer.internalTopicPrefix(Topics.Organization),
//       },
//     ],
//   },
//   {
//     ...CONSUMER_CONFIG,
//     groupId: 'hermes-wrks-role',
//     maxBytesPerPartition: WORKERS_MAX_BYTES_PER_PARTITION,
//     active: environment.ROLE_WORKER_CONSUME_EVENTS === 'true',
//     topics: [
//       {
//         active: true,
//         concurrency: 4,
//         handlerName: ROLE_HANDLER,
//         name: Consumer.internalTopicPrefix(Topics.Role),
//       },
//     ],
//   },
// ];
