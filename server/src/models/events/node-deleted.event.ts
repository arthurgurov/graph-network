import { Node } from '../node.model'
import { GraphEvent } from './graph-event';

export class NodeDeletedEvent extends GraphEvent<Node> {

  constructor(readonly node: Node) {
    super('NodeDeleted');
  }
}