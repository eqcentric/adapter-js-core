export const LOG = {
  channels: {
    stderr: {
      level: process.env.LOG_LEVEL,
    },
    single: {
      path: __dirname + '/../../var',
    },
    cloudwatch: {
      access_key: process.env.AWS_SECRET_ACCESS_KEY,
      secret_key: process.env.AWS_ACCESS_KEY_ID,
      region: process.env.AWS_REGION,
    },
  },
};
