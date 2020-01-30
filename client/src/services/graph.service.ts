import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GraphServiceConnector } from '../connectors/graph-service.connector';
import { Edge } from '../models/edge.model';
import { EdgeAddedEvent } from '../models/events/edge-added.event';
import { EdgeDeletedEvent } from '../models/events/edge-deleted.event';
import { GraphEvents } from '../models/events/graph-events';
import { NodeAddedEvent } from '../models/events/node-added.event';
import { NodeDeletedEvent } from '../models/events/node-deleted.event';
import { SnapshotEvent } from '../models/events/snapshot.event';
import { Graph } from '../models/graph.model';
import { Node } from '../models/node.model'

@Injectable()
export class GraphService implements OnModuleInit, OnModuleDestroy {

  private readonly logger = new Logger(GraphService.name);

  private graph: Graph;

  private graphSubscription: Subscription;

  constructor(private readonly configService: ConfigService,
              private readonly graphServiceConnector: GraphServiceConnector) {
    // empty
  }

  onModuleInit() {
    this.graphSubscription = this.graphServiceConnector.getGraphStream().pipe(
      tap(event => this.logger.debug('Received new graph event', JSON.stringify(event))),
      tap(event => this.handleEvent(event)),
      tap(() => this.logger.debug('Current graph state', JSON.stringify(this.graph)))
    ).subscribe();
  }

  onModuleDestroy(): any {
    this.graphSubscription.unsubscribe();
  }

  getGraph() {
    // A quick way to deep-clone object
    return JSON.parse(JSON.stringify(this.graph));
  }

  private handleEvent(event: GraphEvents): void {
    switch (event.name) {
      case 'Snapshot':
        this.handleSnapshotEvent((<SnapshotEvent>event).graph);
        break;
      case 'NodeAdded':
        this.handleNodeAddedEvent((<NodeAddedEvent>event).node);
        break;
      case 'NodeDeleted':
        this.handleNodeDeletedEvent((<NodeDeletedEvent>event).node);
        break;
      case 'EdgeAdded':
        this.handleEdgeAddedEvent((<EdgeAddedEvent>event).edge);
        break;
      case 'EdgeDeleted':
        this.handleEdgeDeletedEvent((<EdgeDeletedEvent>event).edge);
        break;
      default:
        this.logger.warn('Unable to handle event with unknown type', event.name);
    }
  }

  private handleSnapshotEvent(graph: Graph): void {
    this.graph = graph;
  }

  private handleNodeAddedEvent(node: Node): void {
    if (!this.graph) {
      return;
    }
    if (!this.graph.nodes) {
      this.graph.nodes = [];
    }
    this.graph.nodes.push(node);
  }

  private handleNodeDeletedEvent(node: Node): void {
    if (!this.graph) {
      return;
    }
    const index = this.graph.nodes.findIndex(n => n.id === node.id);

    this.graph.nodes.splice(index, 1);
  }

  private handleEdgeAddedEvent(edge: Edge): void {
    if (!this.graph) {
      return;
    }
    if (!this.graph.edges) {
      this.graph.edges = [];
    }
    this.graph.edges.push(edge);
  }

  private handleEdgeDeletedEvent(edge: Edge): void {
    if (!this.graph) {
      return;
    }
    const index = this.graph.edges.findIndex(n => n.id === edge.id);

    this.graph.edges.splice(index, 1);
  }
}
