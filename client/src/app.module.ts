import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphServiceConnector } from './connectors/graph-service.connector';
import { GraphService } from './services/graph.service';
import { NodeProducerService } from './services/node-producer.service';
import { TestDataService } from './services/test-data.service';

@Module({
  imports: [ ConfigModule.forRoot() ],
  controllers: [],
  providers: [ GraphServiceConnector, GraphService, NodeProducerService, TestDataService ]
})
export class AppModule {
  // empty
}
