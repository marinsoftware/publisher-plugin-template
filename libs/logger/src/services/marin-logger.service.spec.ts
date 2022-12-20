import { MarinLogger } from './marin-logger.service';

describe('marin-logger.service', () => {
  let marinLogger: MarinLogger;

  beforeEach(() => {
    marinLogger = new MarinLogger({});
    jest.spyOn(marinLogger, 'error').mockReturnValue();
    jest.spyOn(marinLogger, 'info').mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('logs to console', () => {
    marinLogger.log('message', { test: 'hello world' }, 'traceId');
    expect(marinLogger.info).toHaveBeenCalledWith({ message: 'message', extra: { test: 'hello world' }, reqId: 'traceId' });
  });

  it('logs an error to console', () => {
    marinLogger.log('message', { error: 'hello world' });
    expect(marinLogger.error).toHaveBeenCalledWith({ message: 'message', extra: { error: 'hello world' }});
  });
});
