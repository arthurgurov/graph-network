import { sequence } from '../commons/utils/sequence';

export class BaseRepository<T extends { id?: number }> {

  private readonly db = new Array<T>();

  private readonly idIndex = new Map<number, number>();
  private readonly idSequence = sequence();

  query(callback?: (value: T, index: number, array: T[]) => unknown): T[] {
    return callback ? this.db.filter(callback) : this.db;
  }

  create(body: T): number {
    const id = this.idSequence.next().value;
    const value = Object.assign({}, body, { id });
    const index = this.db.length;

    this.db.push(value);
    this.idIndex.set(id, index);

    return id;
  }

  read(id: number): T {
    if (!this.idIndex.has(id)) {
      return null;
    }

    return this.db[ this.idIndex.get(id) ];
  }

  delete(id: number): void {
    if (!this.idIndex.has(id)) {
      return null;
    }

    this.db.splice(this.idIndex.get(id), 1);
    this.idIndex.delete(id);
  }
}


