import { get } from "lodash";
import ResolveSqs from '@sqs/ResolveSqs';
import { SQS } from "aws-sdk";

class SqsSendData {
  private integrationId: number;
  private options: any;
  private apiUrl?: string;
  
  constructor(integrationId: number,  options: any) {
    this.integrationId = integrationId;
    this.options = options;
    this.apiUrl = get(this.options, 'baseURL');
  }

  public request(payload: Array<any>): boolean {
    try {
      const tranId = get(this.options, 'headers.X-Integration-Trans-Id');
    
      const message: SQS.SendMessageRequest = {
        'QueueUrl': this.apiUrl,
        'MessageAttributes': {
          'integration_id': {
              DataType: 'Number',
              StringValue: `${this.integrationId}`
          },
          'X-Integration-Trans-Id': {
              DataType: 'String',
              StringValue: tranId
          }
        },
        'MessageBody': JSON.stringify(payload)
      }
      const sqsClient = ResolveSqs.getInstance().resolveSqs();
      sqsClient.sendMessage(message, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Success", data.MessageId);
        }
      });
      return true;
    } catch (error) {
      console.log(error);
    }
  }
}

export default SqsSendData;