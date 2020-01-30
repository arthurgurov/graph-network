import { Node } from '../node.model'
import { GraphEvent } from './graph-event';

export class NodeAddedEvent extends GraphEvent<Node> {

  constructor(readonly node: Node) {
    super('NodeAdded');
  }
}