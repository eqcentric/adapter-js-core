import { Criteria, TypeMarkField } from "./InternalDto";

export interface CollectionInterface {
  getName(): string;
  getPrimaryKeys(): Array<string>;
  getMongoIndexed(): Array<string>;
  getMongoScope(): string | null;
  getPickFields(): Array<TypeMarkField>;
  getCriterias(integrationId?: number): Array<Criteria>;
  getOptions(): Array<Record<string, string>>;
}
