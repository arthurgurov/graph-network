import { Edge } from '../edge.model';
import { GraphEvent } from './graph-event';

export class EdgeAddedEvent extends GraphEvent<Edge> {

  constructor(readonly edge: Edge) {
    super('EdgeAdded');
  }
}