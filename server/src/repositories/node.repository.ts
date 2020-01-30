import { Injectable } from '@nestjs/common';
import { Node } from '../models/node.model';
import { BaseRepository } from './base-repository';

@Injectable()
export class NodeRepository extends BaseRepository<Node> {
  // empty
}


