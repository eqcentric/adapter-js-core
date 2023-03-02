import { CollectionInterface } from '@Dto/CollectionInterface';
import { Criteria } from '@Dto/InternalDto';
import { MongoTransformer } from '@internal/MongoTransformer';
import { TypeTargetKey } from '@Dto/InternalDto';
import { isEmpty } from 'lodash';

export class MakiniKeys {
  private mongoTransformer: MongoTransformer;
  private static Instance: MakiniKeys = null;

  constructor(integrationId: number) {
    this.mongoTransformer = new MongoTransformer(integrationId);
  }

  static getInstance(integrationId: number): MakiniKeys {
    if (!this.Instance) {
      this.Instance = new MakiniKeys(integrationId);
    }
    return this.Instance;
  }

  keys(record: any, scope: CollectionInterface): object
  {
    const criterias: Array<Criteria> = scope.getCriterias();
    const primaryCriteria = this.getPrimaryCriteria(scope);

    if (!isEmpty(primaryCriteria)) {
      criterias.push(primaryCriteria);
    }

    criterias.map(criteria => {
      record[criteria.sourceKey] = this.mongoTransformer.getKey(record, criteria);
    });

    return record;
  }

  private getPrimaryCriteria(scope: CollectionInterface): Criteria | null {
    if (isEmpty(scope.getMongoScope())) {
      return null;
    }

    const keys: Array<TypeTargetKey> = [];
    scope.getPrimaryKeys().map(field => {
      keys.push({
        key: field,
        value: field,
      });
    });

    return {
      sourceKey: 'key',
      collectionName: scope.getMongoScope(),
      targetKeys: keys,
    };
  }
}

export default MakiniKeys;
