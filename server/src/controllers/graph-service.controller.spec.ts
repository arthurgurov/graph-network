import { Test, TestingModule } from '@nestjs/testing';
import { GraphService } from '../services/graph.service';
import { GraphServiceController } from './graph-service.controller';

describe('GraphServiceController', () => {

  let controller: GraphServiceController;
  let graphService: GraphService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ GraphServiceController ],
      providers: [ {
        provide: GraphService,
        useValue: new GraphService(undefined, undefined)
      } ]
    }).compile();

    controller = app.get<GraphServiceController>(GraphServiceController);
    graphService = app.get<GraphService>(GraphService);
  });

  describe('getGraph', () => {

    it('should return a graph from GraphService.getGraph()', () => {
      const graph = { nodes: [], edges: [] };

      jest.spyOn(graphService, 'getGraph').mockReturnValue(graph);

      expect(controller.getGraph()).toBe(graph);
    });
  });

  describe('addNode', () => {

    it('should call GraphService.addNode()', () => {

      const func = jest.spyOn(graphService, 'addNode').mockImplementation();

      controller.addNode({ label: 'Server A' });

      expect(func).toBeCalled();
    });
  });

  describe('deleteNode', () => {

    it('should call GraphService.deleteNode()', () => {

      const func = jest.spyOn(graphService, 'deleteNode').mockImplementation();

      controller.deleteNode({ id: 10 })

      expect(func).toBeCalled();
    });
  });

  describe('addEdge', () => {

    it('should call GraphService.addEdge()', () => {

      const func = jest.spyOn(graphService, 'addEdge').mockImplementation();

      controller.addEdge({ source: 10, target: 20 });

      expect(func).toBeCalled();
    });
  });

  describe('deleteEdge', () => {

    it('should call GraphService.deleteEdge()', () => {

      const func = jest.spyOn(graphService, 'deleteEdge').mockImplementation();

      controller.deleteEdge({ id: 10 })

      expect(func).toBeCalled();
    });
  });
});
