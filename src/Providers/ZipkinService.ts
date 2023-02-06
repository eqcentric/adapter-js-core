import { SERVICE } from '@Config/service';
import { ProviderContract } from '@providers/ProviderContract';
import { BatchRecorder, jsonEncoder, Tracer, sampler } from 'zipkin';
import { app } from '@Config/app';
import CLSContext from 'zipkin-context-cls';
import { HttpLogger } from 'zipkin-transport-http';

export class ZipkinService implements ProviderContract {
  boot(): any {
    const ctxImpl = new CLSContext('zipkin');
    const host = SERVICE.zipkin.host;
    const port = SERVICE.zipkin.port;
    const zipkinUrl = `${host}:${port}`;
    const sampleRate = SERVICE.zipkin.enable == 'true' ? 1.0 : 0.0;

    const tracer: Tracer = new Tracer({
      ctxImpl,
      recorder: new BatchRecorder({
        logger: new HttpLogger({
          endpoint: `${zipkinUrl}/api/v2/spans`,
          jsonEncoder: jsonEncoder.JSON_V2,
        }),
      }),
      sampler: new sampler.CountingSampler(sampleRate), // @TODO :  The Fetch API is an experimental feature
      traceId128Bit: SERVICE.zipkin.options.traceId128Bit,
      localServiceName: app.app_short_name,
    });

    return tracer;
  }
}
