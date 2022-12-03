export const SERVICE = {
  sentry: {
    dns: process.env.SENTRY_DSN,
  },
  zipkin: {
    host: process.env.ZIPKIN_HOST || 'http://localhost',
    port: process.env.ZIPKIN_HOST || 9411,
    enable: process.env.ZIPKIN_ENABLE || false,
    options: {
      traceId128Bit: false,
      max_tag_len: 1048576,
      request_timeout: 5,
    },
    excluded_paths: ['/'],
  },
};
