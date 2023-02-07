import { Criteria, TypeMarkField } from "./InternalDto";

export interface CollectionInterface {
  getName(): string;
  getPrimaryKeys(): Array<string>;
  getMongoIndexed(): Array<string>;
  getMongoScope(): string | null;
  getPickFields(): Array<TypeMarkField>;
  getCriterias(): Array<Criteria>;
}
