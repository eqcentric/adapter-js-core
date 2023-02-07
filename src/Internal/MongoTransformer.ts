import md5 from 'md5';
import { padStart, omitBy, trim, toString, get, isEmpty } from 'lodash';
import { Criteria, TypeTargetKey } from '@Dto/InternalDto';

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
    const cases = {
      sites: '01',
      SITES: '01',
      assets: '02',
      ASSETS: '02',
      work_orders: '03',
      WORK_ORDERS: '03',
      WO: '03',
      parts: '04',
      PARTS: '04',
      purchase_orders: '05',
      PURCHASE_ORDERS: '05',
      PO: '05',
      pm: '06',
      PM: '06',
      models: '07',
      MODELS: '07',
      counters: '08',
      COUNTERS: '08',
      vendors: '09',
      VENDORS: '09',
      ASSETS_DOWNTIME: '10',
      assets_downtime: '10',
      WORK_REQUESTS: '11',
      work_request: '11',
      COUNTERS_READINGS: '12',
      counters_readings: '12',
      DOCUMENTS: '13',
      documents: '13',
      TEAMS: '14',
      teams: '14',
      line_items: '15',
      LINE_ITEMS: '15',
      accounts: '16',
      ACCOUNTS: '16',
      locations: '17',
      LOCATIONS: '17',
      TEST: '03',
    };

    return cases[collectionName];
  }

  private hashId(input: object): string {
    return md5(JSON.stringify(input));
  }
}
