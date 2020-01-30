import { Edge } from './edge.model';
import { Node } from './node.model';

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}