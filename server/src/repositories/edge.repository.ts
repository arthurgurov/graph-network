import { Injectable } from '@nestjs/common';
import { Edge } from '../models/edge.model';
import { BaseRepository } from './base-repository';

@Injectable()
export class EdgeRepository extends BaseRepository<Edge> {
  // empty
}
