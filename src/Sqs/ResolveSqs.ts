import AWS from 'aws-sdk';

class ResolveSqs {
  private static _instance: ResolveSqs;
  
  private constructor() {}
  
  public resolveSqs(): AWS.SQS {
    let configs = {
      region: process.env.AWS_REGION || "ap-southeast-1",
      version: "2012-11-05",
      credentials: new AWS.Credentials(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY),
    };
    if (process.env.APP_STAGE === "local") {
      configs["endpoint"] = process.env.AWS_LOCAL_URL;
    }

    return new AWS.SQS(configs);
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new ResolveSqs();
    }

    return this._instance;
  }
}

export default ResolveSqs;
