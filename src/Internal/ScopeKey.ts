import { CollectionInterface } from '@Dto/CollectionInterface';
import { TypeTargetKey } from '@Dto/InternalDto';
import { MongoTransformer } from '@internal/MongoTransformer';

export class ScopeKey {
  protected mongoTransformer: MongoTransformer;

  constructor(integrationId: number) {
    this.mongoTransformer = new MongoTransformer(integrationId);
  }

  public key(response: Array<any>, scope: CollectionInterface): Array<any> {
    if (!scope.getMongoScope()) {
      return response;
    }

    const primaryKeys = scope.getPrimaryKeys();
    const targetKeys: Array<TypeTargetKey> = [];
    primaryKeys.map(primaryKey => {
      targetKeys.push({
        key: primaryKey,
        value: primaryKey
      })
    });

    this.mongoTransformer.appendKeys(response, {
      sourceKey: 'key',
      collectionName: scope.getMongoScope(),
      targetKeys: targetKeys,
    });

    return response;
  }
}
