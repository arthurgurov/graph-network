import { Observable } from 'rxjs';
import { EmptyMessage } from '../messages/common/empty.message';
import { IdMessage } from '../messages/common/id.message';
import { AddEdgeMessage } from '../messages/graph/add-edge.message';
import { AddNodeMessage } from '../messages/graph/add-node.message';
import { GraphEvents } from '../models/events/graph-events';
import { Graph } from '../models/graph.model';

export interface GraphService {

  getGraph(body: EmptyMessage): Observable<Graph>;

  getGraphStream(body: EmptyMessage): Observable<GraphEvents>;

  addNode(node: AddNodeMessage): Observable<IdMessage>;

  deleteNode(id: IdMessage): Observable<EmptyMessage>;

  addEdge(edge: AddEdgeMessage): Observable<IdMessage>;

  deleteEdge(id: IdMessage): Observable<EmptyMessage>;
}