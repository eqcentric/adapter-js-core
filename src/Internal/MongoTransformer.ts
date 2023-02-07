import md5 from 'md5';
import { padStart, omitBy, trim, toString, get, isEmpty } from 'lodash';
import { Criteria, TypeTargetKey } from '@Dto/InternalDto';
import { makiniScopes } from '@Config/scopes';

export class MongoTransformer {
  protected hexKey: string;

  constructor(integrationId: number) {
    this.hexKey = padStart(integrationId.toString(16), 6, '0');
  }

  public appendKeys(data: Array<any>, criteria: Criteria): Array<any> {
    for (const item of data) {
      item[criteria.sourceKey] = this.appendKey(item, criteria);
    }

    return data;
  }

  private appendKey(data: any, itemValue: Criteria) {
    const extractFilters = this.extractFilters(itemValue.targetKeys, data, itemValue.isFakeData);
    const filter = omitBy(extractFilters, v => {
      return v === null || trim(toString(v)) === '';
    });
    return this.makeKey(itemValue.collectionName, filter);
  }

  private extractFilters(targetKeys: Array<TypeTargetKey>, data: any, isFakeData?: boolean): Record<string, string | number> {
    const filter: Record<string, string | number> = {};
    targetKeys.map(({ key, value }) => {
      filter[key] = get(data, value);
      if (isFakeData) {
        filter[key] = value;
      }
    });
    return filter;
  }

  private makeKey(collectionName: string, data: Record<string, string | number>): string {
    if (isEmpty(data)) {
      return null;
    }
    const prefix: string = this.prefix(collectionName);
    const id: string = this.hashId(data);
    return `${prefix}${this.hexKey}${id}`;
  }

  private prefix(collectionName: string): string {
    return makiniScopes[collectionName];
  }

  private hashId(input: object): string {
    return md5(JSON.stringify(input));
  }
}
