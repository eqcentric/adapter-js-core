import { Criteria } from '@Dto/InternalDto';
import { MongoTransformer } from '@internal/MongoTransformer';
import { isNull } from 'lodash';

export class AggregateKeys {
  protected mongoTransformer: MongoTransformer;

  constructor(integrationId: number) {
    this.mongoTransformer = new MongoTransformer(integrationId);
  }

  public relationKeys(response: Array<any>, criterias: Array<Criteria> | null): Array<any> {
    if ( isNull(criterias) ) {
      return response;
    }

    for (const criteria of criterias) {
      this.mongoTransformer.appendKeys(response, criteria);
    }

    return response;
  }
}
