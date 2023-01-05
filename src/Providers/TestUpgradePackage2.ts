import * as Sentry from '@sentry/node';
import '@sentry/tracing';
import {ProviderContract} from '@providers/ProviderContract';
import {SERVICE} from "@Config/service";

export class TestUpgradePackage2 implements ProviderContract {
    boot(): any {
        Sentry.init({
            dsn: SERVICE.sentry.dns,
            tracesSampleRate: 1.0,
        });
    }
}
