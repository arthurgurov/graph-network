import { Module } from '@nestjs/common';
import { TestServiceController } from './controllers/test-service.controller';
import { GraphServiceController } from './controllers/graph-service.controller';
import { EdgeRepository } from './repositories/edge.repository';
import { NodeRepository } from './repositories/node.repository';
import { GraphService } from './services/graph.service';

@Module({
  imports: [],
  controllers: [ GraphServiceController, TestServiceController ],
  providers: [ GraphService, EdgeRepository, NodeRepository ]
})
export class AppModule {
  // empty
}
