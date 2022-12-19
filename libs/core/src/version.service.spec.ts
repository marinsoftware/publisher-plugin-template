import * as fs from 'fs';
import * as rl from 'readline';

jest.mock('fs');
jest.mock('readline');
import { IMPLEMENTATION_VERSION, SPECIFICATION_VERSION, VersionService } from './version.service';


describe('version.service', () => {
  let service: VersionService;

  beforeEach(() => {
    service = new VersionService();
    service.pathToBase = './';
  });

  it('gets the version file', async () => {
    (fs.readdirSync as any).mockReturnValue([ 'VERSION-1', 'ANOTHER_FILE' ]);

    expect(await service.getVersionFile()).toContain('VERSION-1');
  });

  it('gets the version from file', async () => {
    (fs.readdirSync as any).mockReturnValue([ 'VERSION-1', 'ANOTHER_FILE' ]);
    (rl.createInterface as any).mockReturnValue({
      on: jest.fn().mockImplementation((evt, cb) => {
        cb(`${SPECIFICATION_VERSION}: some-version`);
        cb(`${IMPLEMENTATION_VERSION}: some-implementation`);
        cb('another-setting: some-value');
      }),
    });

    const version = await service.getVersionFromFile();
    expect(version).toEqual('some-version : some-implementation');
  });
});