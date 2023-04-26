import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import { padEnd, merge, pick } from "lodash";
import { Helpers } from "@Utils/Helpers";
import SqsSendData from '@sqs/SqsSendData';
import {
  internalMetadata,
  internalTransDto,
  internalPayloadStatus,
  internalScopesNotify,
  internalPayload
} from '@Dto/InternalDto';

export class ApiClient {
  public readonly options?: AxiosRequestConfig;
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

    return Helpers.isSQS() ? this.sendSqsData(payload, collectionName) : this.sendLambdaData(payload, collectionName)
  }

  async sendLambdaData(data: internalPayload, collectionName: string): Promise<boolean> {
    try {
      const payload = this.buildData(data, collectionName);
      await this.client.put(
        `/internal/integrations/${this.integrationId}/data`,
        payload
      );
  
      return true;
    } catch (error) {
      throw error;
    }
  }

  async sendSqsData(data: internalPayload, collectionName: string): Promise<boolean> {
    try {
      const sqs = new SqsSendData(this.integrationId, this.options);
      const payload = this.buildData(data, collectionName);

      return sqs.request(payload);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  buildData(payload: internalPayload, collectionName: string): any {
    const body = {
      meta: this.metaData,
      extraData: {
        isGenerateKey: this.mappingOutputViews.has(collectionName),
        collectionName: this.mappingOutputViews.get(collectionName),
        hexKey: padEnd(this.integrationId.toString(16), 6, "0"),
      },
      ...payload,
    };
    return body;
  }

  async notifyStatus(payload: internalPayloadStatus): Promise<boolean>{
    if ( Helpers.isSQS() ) {
      return true;
    }
    return await this.client.put(
      `/internal/integrations/${this.integrationId}/status`,
      payload
    );
  }

  async notifySyncByScopes(payload: internalScopesNotify): Promise<boolean> {
    if ( Helpers.isSQS() ) {
      return true;
    }
    return await this.client.post(
      `/internal/integrations/${this.integrationId}/notify-sync-done`,
      payload
    );
  }
}
