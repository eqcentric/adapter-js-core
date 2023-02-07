import { CollectionInterface } from '@Dto/CollectionInterface';
import { Criteria } from '@Dto/InternalDto';
import { MongoTransformer } from '@internal/MongoTransformer';
import { TypeTargetKey } from '@Dto/InternalDto';
import { isNull } from 'lodash';

export class AggregateKeys {
  protected mongoTransformer: MongoTransformer;

  constructor(integrationId: number) {
    this.mongoTransformer = new MongoTransformer(integrationId);
  }

  public makeKeys(response: Array<any>, scope: CollectionInterface): Array<any> {
    const criterias: Array<Criteria> = scope.getCriterias();
    const targetKeys: Array<TypeTargetKey> = [];
    const primaryKeys = scope.getPrimaryKeys();
    primaryKeys.map(primaryKey => {
      targetKeys.push({
        key: primaryKey,
        value: primaryKey
      })
    });
    const keyCriteria = {
      sourceKey: 'key',
      collectionName: scope.getMongoScope(),
      targetKeys: targetKeys,
    };
    criterias.push(keyCriteria);
    if ( isNull(criterias) ) {
      return response;
    }

    for (const criteria of criterias) {
      this.mongoTransformer.appendKeys(response, criteria);
    }

    return response;
  }
}
