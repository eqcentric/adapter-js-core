import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import { padStart, merge, pick } from "lodash";
import {
  internalMetadata,
  internalTransDto,
  internalPayloadStatus,
  internalScopesNotify,
} from '@Dto/InternalDto';

export class ApiClient {
  private readonly options?: AxiosRequestConfig;
  private client: AxiosInstance;
  private readonly apiUrl: string;
  private readonly integrationId: number;
  private readonly metaData: internalMetadata;
  private mappingOutputViews: Map<string, string>;

  constructor(apiUrl: string, integrationId: number, options?: any) {
    this.apiUrl = apiUrl;
    this.integrationId = integrationId;
    this.options = {
      baseURL: apiUrl,
      timeout: 1000 * 120, // 120(s)
      headers: {
        Accept: "application/json",
      },
    };

    // Support send meta data
    if (options.meta) {
      const meta: internalMetadata = options.meta;
      delete options.meta;

      if (meta.action == undefined) {
        meta.action = "insert";
      }

      if (meta.scopes == undefined) {
        meta.scopes = [];
      }

      this.metaData = pick(meta, ["action", "scopes"]);
    }

    // support tracing packages
    const tracingData: internalTransDto = options.tracingData;
    delete options.tracingData;
    if (tracingData.id != undefined && tracingData.env != undefined) {
      merge(this.options.headers, {
        "X-Integration-Trans-Id": tracingData.id,
        "X-Integration-Env": tracingData.env,
      });
    }

    // support for extraData
    if (options.mappingOutputViews) {
      this.mappingOutputViews = options.mappingOutputViews;
      delete options.mappingOutputViews;
    }

    this.options = merge(this.options, options);

    this.client = axios.create(this.options);
  }

  async sendData(data: Array<any>, keys: Array<any>, collectionName: string): Promise<boolean> {
    const payload = {
      keys,
      data: {
        [collectionName]: data,
      },
    };

    const body = {
      meta: this.metaData,
      extraData: {
        isGenerateKey: this.mappingOutputViews.has(collectionName),
        collectionName: this.mappingOutputViews.get(collectionName),
        hexKey: padStart(this.integrationId.toString(16), 6, "0"),
      },
      ...payload,
    };

    await this.client.put(
      `/internal/integrations/${this.integrationId}/data`,
      body
    );

    return true;
  }

  notifyStatus(payload: internalPayloadStatus): Promise<boolean> {
    return this.client.put(
      `/internal/integrations/${this.integrationId}/status`,
      payload
    );
  }

  notifySyncByScopes(payload: internalScopesNotify): Promise<boolean> {
    return this.client.post(
      `/internal/integrations/${this.integrationId}/notify-sync-done`,
      payload
    );
  }
}
