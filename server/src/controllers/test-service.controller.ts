import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GraphService } from '../services/graph.service';

@Controller()
export class TestServiceController {

  constructor(private readonly graphService: GraphService) {
    // empty
  }

  @GrpcMethod('TestService', 'PopulateTestData')
  private populateTestData(): void {
    [ 'Server A', 'Server B', 'Server C', 'Server D', 'Server E' ]
      .forEach(label => this.graphService.addNode({ label }));

    [ { source: 0, target: 1 },
      { source: 1, target: 2 },
      { source: 2, target: 3 },
      { source: 3, target: 4 },
      { source: 4, target: 0 }
    ].forEach(edge => this.graphService.addEdge(edge));
  }
}
