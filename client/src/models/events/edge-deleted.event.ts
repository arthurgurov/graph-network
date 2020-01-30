import { Edge } from '../edge.model';
import { GraphEvent } from './graph-event';

export class EdgeDeletedEvent extends GraphEvent<Edge> {

  constructor(readonly edge: Edge) {
    super('EdgeDeleted');
  }
}