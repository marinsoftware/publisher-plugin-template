import { Test, TestingModule } from '@nestjs/testing';
import { GelfLogger } from './gelf-logger.service';

describe('GelfLogger', () => {
  let service: GelfLogger;
  let messageSpy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GelfLogger],
    }).compile();

    service = module.get<GelfLogger>(GelfLogger);
    messageSpy = jest.spyOn(service.gelfLogger, 'message');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a debug message as a string', () => {
    messageSpy.mockReturnValue();
    service.debug<string, object>('debug_type', 'some message', { param: 'some param' });
    expect(messageSpy).toHaveBeenCalled();
    const args = messageSpy.mock.calls[0];
    expect(args[0]).toEqual('debug_type');
    expect(args[1]).toEqual(7);
    expect(args[2].message).toEqual('some message');
    expect(args[2].params).toEqual({ param: 'some param' });
  });

  it('should send a debug message as an object', () => {
    messageSpy.mockReturnValue();
    service.debug<object, object>('debug_type', { newMessage: 'hello world' }, { param: 'some param' });
    expect(messageSpy).toHaveBeenCalled();
    const args = messageSpy.mock.calls[0];
    expect(args[2].newMessage).toEqual('hello world');
  });
});