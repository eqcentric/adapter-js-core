import RouteRegistrar from '@http/RouteRegistrar';
import ProviderContract from '@providers/ProviderContract';
import { Express } from 'express';

class RouterService implements ProviderContract {
  protected app: Express;

  constructor(app: Express) {
    this.app = app;
  }

  public boot() {
    const provider = new RouteRegistrar();
    this.app.use(provider.register());
  }
}

export default RouterService;
