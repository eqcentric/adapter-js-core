export class MongoUtil {
  static createView(viewName: string, viewOn: string, pipeline: Array<any>): object {
    return {
      create: viewName,
      viewOn: viewOn,
      pipeline: pipeline,
    };
  }

  static lookup(from: string, localField: string, foreignField: string, as: string): object {
    return {
      $lookup: {
        from: from,
        localField: localField,
        foreignField: foreignField,
        as: as,
      },
    };
  }

  static lookupWithPipelines(from: string, lets: object, pipeline: Array<any>, as: string): object {
    return {
      $lookup: {
        from: from,
        let: lets,
        pipeline: pipeline,
        as: as,
      },
    };
  }

  static addFields(fields: any): object {
    return { $addfields: fields };
  }

  static arrayElemAt(expression: string, index: number): object {
    return { $arrayElemAt: [expression, index] };
  }

  static arrayFirst(expression: string): object {
    return this.arrayElemAt(expression, 0);
  }

  static arrayLast(expression: string): object {
    return { $last: expression };
  }

  static matchWithNeField(expression: string, value: any): object {
    return { $match: { [expression]: { $ne: value } } };
  }

  static matchWithEqField(expression: string, value: any): object {
    return { $match: { [expression]: { $eq: value } } };
  }

  static matchExistsField(expression: string, value: any): object {
    return { $match: { [expression]: { $exists: value } } };
  }

  static if(_if: object, _else: any, _then: any): object {
    return { $cond: { if: _if, else: _else, then: _then } };
  }

  static toString(expression: string, defaultValue: string = null): object {
    return this.typeOf(expression, '$toString', defaultValue);
  }

  static toInt(expression: string, defaultValue = 0): object {
    return this.typeOf(expression, '$toInt', defaultValue);
  }

  static toFloat(expression: string, defaultValue = 0.0): object {
    return this.typeOf(expression, '$toFloat', defaultValue);
  }

  static toDouble(expression: string, defaultValue = 0.0) {
    return this.typeOf(expression, '$toDouble', defaultValue);
  }

  static toBool(expression: string, defaultValue = false) {
    return this.typeOf(expression, '$toBool', defaultValue);
  }

  static toDate(expression: string, defaultValue: any = null) {
    return this.typeOf(expression, '$toDate', defaultValue);
  }

  private static typeOf(expression: string, toType: string, defaultValue: any = null): object {
    return { $ifNull: [{ [toType]: expression }, defaultValue] };
  }
}
