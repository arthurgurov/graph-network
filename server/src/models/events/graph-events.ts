import { EdgeAddedEvent } from './edge-added.event';
import { EdgeDeletedEvent } from './edge-deleted.event';
import { NodeAddedEvent } from './node-added.event';
import { NodeDeletedEvent } from './node-deleted.event';
import { SnapshotEvent } from './snapshot.event';

export type GraphEvents = SnapshotEvent
  | EdgeAddedEvent | EdgeDeletedEvent
  | NodeAddedEvent | NodeDeletedEvent;