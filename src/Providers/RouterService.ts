import { ProviderContract } from '@providers/ProviderContract';
import { Express, Router } from 'express';

export class RouterService implements ProviderContract {
  protected app: Express;
  protected router: Router;

  constructor(app: Express, router: Router) {
    this.app = app;
    this.router = router;
  }

  public boot() {
    this.app.use(this.router);
  }
}
