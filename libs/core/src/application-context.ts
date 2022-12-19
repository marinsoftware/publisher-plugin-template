import pkg from '../../../package.json';

class ApplicationContextService {
  protected projectRoot: string;
  protected _applicationName: string;
  protected _initialized = false;

  constructor() {
    // Set the application name
    this._applicationName = (pkg as any).name;
  }

  /**
   * Get the application name
   */
  public getApplicationName() {
    return this._applicationName;
  }
}

const contextService: ApplicationContextService = new ApplicationContextService();

export { contextService };