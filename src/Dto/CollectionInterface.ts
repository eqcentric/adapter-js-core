export interface CollectionInterface {
  getName(): string;
  getPrimaryKeys(): Array<string>;
  getMongoIndexed(): Array<string>;
  getMongoScope(): string | null;
}
