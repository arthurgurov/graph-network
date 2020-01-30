import { Graph } from '../graph.model';
import { GraphEvent } from './graph-event';

export class SnapshotEvent extends GraphEvent<Graph> {

  constructor(readonly graph: Graph) {
    super('Snapshot');
  }
}