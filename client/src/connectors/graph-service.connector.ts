import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { grpcClientOptions } from '../grpc-client.options';
import { AddEdgeMessage } from '../messages/graph/add-edge.message';
import { AddNodeMessage } from '../messages/graph/add-node.message';
import { GraphEvents } from '../models/events/graph-events';
import { Graph } from '../models/graph.model';
import { GraphService } from './graph-service.interface';


@Injectable()
export class GraphServiceConnector implements OnModuleInit {

  @Client(grpcClientOptions)
  private readonly client: ClientGrpc;

  private graphService: GraphService;

  onModuleInit() {
    this.graphService = this.client.getService<GraphService>('GraphService');
  }

  getGraph(): Observable<Graph> {
    return this.graphService.getGraph({});
  }

  getGraphStream(): Observable<GraphEvents> {
    return this.graphService.getGraphStream({});
  }

  addNode(node: AddNodeMessage): Observable<number> {
    const subject = new Subject<number>();

    this.graphService.addNode(node).pipe(
      map(({ id }) => id)
    ).subscribe(subject);

    return subject;
  }

  deleteNode(id: number): Observable<void> {
    const subject = new Subject<void>();

    this.graphService.deleteNode({ id }).pipe(
      map(() => undefined)
    ).subscribe(subject);

    return subject;
  }

  addEdge(edge: AddEdgeMessage): Observable<number> {
    return this.graphService.addEdge(edge).pipe(
      map(({ id }) => id)
    );
  }

  deleteEdge(id: number): Observable<void> {
    const subject = new Subject<void>();

    this.graphService.deleteEdge({ id }).pipe(
      map(() => undefined)
    ).subscribe(subject);

    return subject;
  }
}
