import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mergeMap, tap } from 'rxjs/operators';
import { GraphServiceConnector } from '../connectors/graph-service.connector';
import { Graph } from '../models/graph.model';
import { GraphService } from './graph.service';

@Injectable()
export class NodeProducerService implements OnModuleInit {

  private readonly logger = new Logger(NodeProducerService.name);

  constructor(private readonly configService: ConfigService,
              private readonly graphService: GraphService,
              private readonly graphServiceConnector: GraphServiceConnector) {
    // empty
  }

  onModuleInit() {
    if (this.configService.get('PRODUCE_NEW_NODES') === 'true') {

      this.logger.debug('Starting new nodes producer...');

      let i = 1;

      setInterval(() => this.produceNode(i++), 60000);
    }
  }

  private produceNode(index: number) {
    const graph: Graph = this.graphService.getGraph();

    if (!graph) {
      this.logger.warn('Unable to produce a node because the graph is missing!');
      return;
    }

    this.logger.debug('Producing new node...');

    const existingNode = graph.nodes.length
      ? graph.nodes[ Math.floor(Math.random() * (graph.nodes.length - 1)) ]
      : null;

    const label = `Server ${this.configService.get('PORT')}-${index}`;
    const observable = this.graphServiceConnector.addNode({ label });

    observable.subscribe(() => this.logger.log(`Successfully added the new node: ${label}`));

    if (existingNode) {
      observable.pipe(
        tap(id => this.logger.warn(`New node ID: ${id}, Old node ID: ${existingNode.id}`)),
        mergeMap(id => this.graphServiceConnector.addEdge({
          source: existingNode.id,
          target: id
        }))
      ).subscribe(() => this.logger.log(`Successfully connected the new node to node: ${existingNode.label}`));
    }
  }
}
