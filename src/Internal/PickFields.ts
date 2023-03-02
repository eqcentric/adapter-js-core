import { TypeMarkField } from '@Dto/InternalDto';
import { get } from 'lodash';

export class PickFields {
  public field(record: any, pickFields: Array<TypeMarkField>): void {
    for (const pickField of pickFields) {
      record[pickField.target] = get(record, pickField.source);
    }
  }
}
