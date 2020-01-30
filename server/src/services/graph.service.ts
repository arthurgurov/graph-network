import { BadRequestException, Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { Edge } from '../models/edge.model';
import { EdgeAddedEvent } from '../models/events/edge-added.event';
import { EdgeDeletedEvent } from '../models/events/edge-deleted.event';
import { GraphEvents } from '../models/events/graph-events';
import { NodeAddedEvent } from '../models/events/node-added.event';
import { NodeDeletedEvent } from '../models/events/node-deleted.event';
import { SnapshotEvent } from '../models/events/snapshot.event';
import { Graph } from '../models/graph.model';
import { Node } from '../models/node.model';
import { EdgeRepository } from '../repositories/edge.repository';
import { NodeRepository } from '../repositories/node.repository';

@Injectable()
export class GraphService {

  private changes$ = new Subject<GraphEvents>();

  constructor(private readonly nodeRepository: NodeRepository,
              private readonly edgeRepository: EdgeRepository) {
    // empty
  }

  getGraph(): Graph {
    return {
      nodes: this.nodeRepository.query(),
      edges: this.edgeRepository.query()
    };
  }

  getGraphStream$(): Observable<GraphEvents> {
    // Return a stream starting from a complete snapshot
    return this.changes$.pipe(
      startWith(new SnapshotEvent(this.getGraph()))
    );
  }

  addNode(node: Node): number {
    const newId = this.nodeRepository.create(node);

    // Produce "NodeAdded" event
    this.changes$.next(new NodeAddedEvent(this.nodeRepository.read(newId)));

    return newId;
  }

  deleteNode(id: number): void {
    const node = this.nodeRepository.read(id);

    // Verify that the node exists
    if (!node) {
      return;
    }

    // Remove all connected edges
    this.edgeRepository.query(value => value.source === id || value.target === id)
      .forEach(edge => this.deleteEdge(edge.id));

    this.nodeRepository.delete(id);

    // Produce "NodeDeleted" event
    this.changes$.next(new NodeDeletedEvent(node));
  }

  addEdge(edge: Edge): number {
    // Verify that the referenced nodes exist
    if (!this.nodeRepository.read(edge.source)) {
      throw new BadRequestException('Wrong source node!');
    }
    if (!this.nodeRepository.read(edge.target)) {
      throw new BadRequestException('Wrong target node!');
    }

    const newId = this.edgeRepository.create(edge);

    // Produce "EdgeAdded" event
    this.changes$.next(new EdgeAddedEvent(this.edgeRepository.read(newId)));

    return newId;
  }

  deleteEdge(id: number): void {
    const edge = this.edgeRepository.read(id);

    // Verify that the edge exists
    if (!edge) {
      return;
    }

    this.edgeRepository.delete(id);

    // Produce "EdgeDeleted" event
    this.changes$.next(new EdgeDeletedEvent(edge));
  }
}
