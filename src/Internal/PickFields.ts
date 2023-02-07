import { TypeMarkField } from '@Dto/InternalDto';
import { get, isNull } from 'lodash';

export class PickFields {
  public fields(response: Array<any>, pickFields: Array<TypeMarkField>): Array<any> {
    if ( isNull(pickFields) ) {
      return response;
    }
    for (const record of response) {
      this.field(record, pickFields);
    }

    return response;
  }

  private field(record: any, pickFields: Array<TypeMarkField>): void {
    for (const pickField of pickFields) {
      record[pickField.target] = get(record, pickField.source);

      console.log(pickField.target);
      console.log(get(record, pickField.source));
    }
  }
}
