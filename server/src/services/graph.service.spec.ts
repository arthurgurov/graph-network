import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GraphEvent } from '../models/events/graph-event';
import { EdgeRepository } from '../repositories/edge.repository';
import { NodeRepository } from '../repositories/node.repository';
import { GraphService } from '../services/graph.service';

describe('GraphService', () => {
  let service: GraphService;
  let edgeRepository: EdgeRepository;
  let nodeRepository: NodeRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [ GraphService, EdgeRepository, NodeRepository ]
    }).compile();

    service = app.get<GraphService>(GraphService);
    edgeRepository = app.get<EdgeRepository>(EdgeRepository);
    nodeRepository = app.get<NodeRepository>(NodeRepository);
  });

  describe('getGraph', () => {

    it('should return a graph', () => {

      jest.spyOn(nodeRepository, 'query')
        .mockReturnValue([ { id: 10, label: 'Server A' }, { id: 20, label: 'Server B' } ]);

      jest.spyOn(edgeRepository, 'query')
        .mockReturnValue([ { source: 10, target: 20 } ]);

      const graph = service.getGraph();

      expect(graph.nodes.length).toBe(2);
      expect(graph.edges.length).toBe(1);
    });
  });

  describe('getGraphStream', () => {

    it('should begin from a graph snapshot', () => {

      jest.spyOn(nodeRepository, 'query')
        .mockReturnValue([ { id: 10, label: 'Server A' }, { id: 20, label: 'Server B' } ]);

      jest.spyOn(edgeRepository, 'query')
        .mockReturnValue([ { source: 10, target: 20 } ]);

      const events: GraphEvent<any>[] = [];

      const subscription = service.getGraphStream$()
        .subscribe(event => events.push(event));

      subscription.unsubscribe();

      expect(events.length).toBe(1);
      expect(events[ 0 ].name).toBe('Snapshot');
    });
  });

  describe('addNode', () => {

    it('should call NodeRepository.create()', () => {

      const createFunc = jest.spyOn(nodeRepository, 'create').mockReturnValue(10);
      const readFunc = jest.spyOn(nodeRepository, 'read').mockReturnValue({
        id: 10,
        label: 'Server A'
      });

      service.addNode({ label: 'Server A' });

      expect(createFunc).toBeCalled();
      expect(readFunc).toBeCalledWith(10);
    });

    it('should notify about changes', () => {

      jest.spyOn(nodeRepository, 'create').mockReturnValue(10);
      jest.spyOn(nodeRepository, 'read').mockReturnValue({
        id: 10,
        label: 'Server A'
      });

      const events: GraphEvent<any>[] = [];

      const subscription = service.getGraphStream$()
        .subscribe(event => events.push(event));

      service.addNode({ label: 'Server A' });

      subscription.unsubscribe();

      expect(events.length).toBe(2);
      expect(events[ 0 ].name).toBe('Snapshot');
      expect(events[ 1 ].name).toBe('NodeAdded');
    });
  });

  describe('deleteNode', () => {

    it('should not delete non-existing nodes', () => {

      const readFunc = jest.spyOn(nodeRepository, 'read').mockReturnValue(null);
      const deleteFunc = jest.spyOn(nodeRepository, 'delete').mockImplementation();

      service.deleteNode(10);

      expect(readFunc).toBeCalledWith(10);
      expect(deleteFunc).toBeCalledTimes(0);
    });

    it('should call NodeRepository.delete()', () => {

      const readFunc = jest.spyOn(nodeRepository, 'read').mockReturnValue({
        id: 10,
        label: 'Server A'
      });
      const deleteFunc = jest.spyOn(nodeRepository, 'delete').mockImplementation();

      jest.spyOn(nodeRepository, 'query').mockReturnValue([]);

      service.deleteNode(10);

      expect(readFunc).toBeCalledWith(10);
      expect(deleteFunc).toBeCalledWith(10);
    });


    it('should call remove connected edges', () => {

      jest.spyOn(nodeRepository, 'read').mockReturnValue({
        id: 10,
        label: 'Server A'
      });
      jest.spyOn(nodeRepository, 'delete').mockImplementation();

      const deleteEdgeFunc = jest.spyOn(service, 'deleteEdge').mockImplementation();

      const edges = [ {
        id: 1,
        source: 10,
        target: 20
      }, {
        id: 2,
        source: 20,
        target: 30
      }, {
        id: 3,
        source: 30,
        target: 10
      } ];

      jest.spyOn(edgeRepository, 'query').mockImplementation(callback => edges.filter(callback));

      service.deleteNode(10);

      expect(deleteEdgeFunc).toBeCalledWith(1);
      expect(deleteEdgeFunc).toBeCalledWith(3);
    });

    it('should notify about changes', () => {

      jest.spyOn(nodeRepository, 'read').mockReturnValue({
        id: 10,
        label: 'Server A'
      });
      jest.spyOn(nodeRepository, 'delete').mockImplementation();

      jest.spyOn(nodeRepository, 'query').mockReturnValue([]);

      const events: GraphEvent<any>[] = [];

      const subscription = service.getGraphStream$()
        .subscribe(event => events.push(event));

      service.deleteNode(10);

      subscription.unsubscribe();

      expect(events.length).toBe(2);
      expect(events[ 0 ].name).toBe('Snapshot');
      expect(events[ 1 ].name).toBe('NodeDeleted');
    });
  });

  describe('addEdge', () => {

    it('should not create an edge connected to a wrong source', () => {

      jest.spyOn(nodeRepository, 'read')
        .mockImplementation(id => id === 20 ? { id: 20, label: 'Server B' } : null);

      expect(() => service.addEdge({ source: 10, target: 20 }))
        .toThrow(BadRequestException);
    });

    it('should not create an edge connected to a wrong target', () => {

      jest.spyOn(nodeRepository, 'read')
        .mockImplementation(id => id === 10 ? { id: 10, label: 'Server A' } : null);

      expect(() => service.addEdge({ source: 10, target: 20 }))
        .toThrow(BadRequestException);
    });

    it('should call EdgeRepository.create()', () => {

      const createFunc = jest.spyOn(edgeRepository, 'create').mockImplementation();

      jest.spyOn(nodeRepository, 'read').mockImplementation(id => {
        switch (id) {
          case 10:
            return { id: 10, label: 'Server A' };
          case 20:
            return { id: 20, label: 'Server B' };
          default:
            return null;
        }
      });

      service.addEdge({ source: 10, target: 20 });

      expect(createFunc).toBeCalled();
    });

    it('should notify about changes', () => {

      jest.spyOn(edgeRepository, 'create').mockImplementation();

      jest.spyOn(nodeRepository, 'read').mockImplementation(id => {
        switch (id) {
          case 10:
            return { id: 10, label: 'Server A' };
          case 20:
            return { id: 20, label: 'Server B' };
          default:
            return null;
        }
      });

      const events: GraphEvent<any>[] = [];

      const subscription = service.getGraphStream$()
        .subscribe(event => events.push(event));

      service.addEdge({ source: 10, target: 20 });

      subscription.unsubscribe();

      expect(events.length).toBe(2);
      expect(events[ 0 ].name).toBe('Snapshot');
      expect(events[ 1 ].name).toBe('EdgeAdded');
    });
  });

  describe('deleteEdge', () => {

    it('should not delete non-existing edges', () => {

      const readFunc = jest.spyOn(edgeRepository, 'read').mockReturnValue(null);
      const deleteFunc = jest.spyOn(edgeRepository, 'delete').mockImplementation();

      service.deleteEdge(10);

      expect(readFunc).toBeCalledWith(10);
      expect(deleteFunc).toBeCalledTimes(0);
    });

    it('should call EdgeRepository.delete()', () => {

      const readFunc = jest.spyOn(edgeRepository, 'read').mockReturnValue({
        id: 1,
        source: 10,
        target: 20
      });
      const deleteFunc = jest.spyOn(edgeRepository, 'delete').mockImplementation();

      service.deleteEdge(10);

      expect(readFunc).toBeCalledWith(10);
      expect(deleteFunc).toBeCalledWith(10);
    });

    it('should notify about changes', () => {

      jest.spyOn(edgeRepository, 'read').mockReturnValue({
        id: 10,
        source: 10,
        target: 20
      });
      jest.spyOn(edgeRepository, 'delete').mockImplementation();

      const events: GraphEvent<any>[] = [];

      const subscription = service.getGraphStream$()
        .subscribe(event => events.push(event));

      service.deleteEdge(10);

      subscription.unsubscribe();

      expect(events.length).toBe(2);
      expect(events[ 0 ].name).toBe('Snapshot');
      expect(events[ 1 ].name).toBe('EdgeDeleted');
    });
  });
});
