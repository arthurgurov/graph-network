import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphServiceConnector } from '../connectors/graph-service.connector';

@Injectable()
export class TestDataService implements OnModuleInit {

  private readonly logger = new Logger(TestDataService.name);

  constructor(private readonly configService: ConfigService,
              private readonly graphServiceConnector: GraphServiceConnector) {
    // empty
  }

  async onModuleInit() {
    if (this.configService.get('POPULATE_TEST_DATA') === 'true') {

      this.logger.debug('Populating basic test data...');

      const serverA_Id = await this.addNode('Server A');
      const serverB_Id = await this.addNode('Server B');
      const serverC_Id = await this.addNode('Server C');
      const serverD_Id = await this.addNode('Server D');
      const serverE_Id = await this.addNode('Server E');

      await this.addEdge(serverA_Id, serverB_Id);
      await this.addEdge(serverB_Id, serverC_Id);
      await this.addEdge(serverC_Id, serverD_Id);
      await this.addEdge(serverD_Id, serverE_Id);
      await this.addEdge(serverE_Id, serverA_Id);

      this.logger.log('Successfully populated basic test data');
    }
  }

  private addNode(label: string): Promise<number> {
    return this.graphServiceConnector.addNode({ label }).toPromise();
  }

  private addEdge(source: number, target: number): Promise<number> {
    return this.graphServiceConnector.addEdge({ source, target }).toPromise()
  }
}
