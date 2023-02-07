export type internalTransDto = {
  id: string;
  env: string;
}

export type internalPayloadStatus = {
  progress: number;
  status: string;
}

export type internalScopesNotify = {
  scopes: Array<string>;
  type: number;
}

export type internalMetadata = {
  action: string;
  scopes: Array<string>;
}

export type internalPayload = {
  keys: Array<string>,
  data: any;
}

export type TypeTargetKey = {
  key: string;
  value: string | number;
};

export type Criteria = {
  sourceKey: string;
  collectionName: string;
  isFakeData?: boolean;
  targetKeys?: Array<TypeTargetKey>;
};

export type TypeMarkField = {
  source: string;
  target: string;
};
