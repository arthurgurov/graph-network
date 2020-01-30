import { Controller } from '@nestjs/common';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { IdMessage } from '../messages/common/id.message';
import { AddEdgeMessage } from '../messages/graph/add-edge.message';
import { AddNodeMessage } from '../messages/graph/add-node.message';
import { GraphEvents } from '../models/events/graph-events';
import { Graph } from '../models/graph.model';
import { GraphService } from '../services/graph.service';

@Controller()
export class GraphServiceController {

  constructor(private readonly graphService: GraphService) {
    // empty
  }

  @GrpcMethod('GraphService', 'GetGraph')
  getGraph(): Graph {
    return this.graphService.getGraph();
  }

  @GrpcStreamMethod('GraphService', 'GetGraphStream')
  getGraphStream(): Observable<GraphEvents> {
    return this.graphService.getGraphStream$();
  }

  @GrpcMethod('GraphService', 'AddNode')
  addNode(node: AddNodeMessage): IdMessage {
    const id = this.graphService.addNode(node);

    return { id };
  }

  @GrpcMethod('GraphService', 'DeleteNode')
  deleteNode(id: IdMessage): void {
    this.graphService.deleteNode(id.id);
  }

  @GrpcMethod('GraphService', 'AddEdge')
  addEdge(edge: AddEdgeMessage): IdMessage {
    const id = this.graphService.addEdge(edge);

    return { id };
  }

  @GrpcMethod('GraphService', 'DeleteEdge')
  deleteEdge(id: IdMessage): void {
    this.graphService.deleteEdge(id.id);
  }
}
