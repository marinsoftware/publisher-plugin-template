import { Injectable } from '@nestjs/common';
import { createReadStream, readdirSync } from 'fs';
import { join, resolve } from 'path';
import * as rl from 'readline';

// Prefix for the version file. Used to find the version file.
const VERSION_FILE_PREFIX = 'VERSION';

export const SPECIFICATION_VERSION = 'Specification-Version';
export const IMPLEMENTATION_VERSION = 'Implementation-Version';

@Injectable()
export class VersionService {
  protected relativePathToBase = '../../../';
  protected _version: string;

  /**
   * Set the path to base
   */
  public set pathToBase(path: string) {
    this.relativePathToBase = path;
  }

  /**
   * Get the version string
   */
  public async version(): Promise<string> {
    if (!this._version) {
      this._version = await this.getVersionFromFile();
    }

    return this._version;
  }

  /**
   * Get the version from the file
   */
  public async getVersionFromFile(): Promise<string> {
    const versionFile = this.getVersionFile();
    const promise = new Promise<string>( (resolve, reject) => {
      const readline = rl.createInterface({
        input: createReadStream(versionFile),
      });
      let specificationVersion: string;
      let implementationVersion: string;

      readline.on('line', (line) => {
        if (line.includes(SPECIFICATION_VERSION)) {
          specificationVersion = (line.split(':')[1]).trim();
        } else if (line.includes(IMPLEMENTATION_VERSION)) {
          implementationVersion = (line.split(':')[1]).trim();
        }

        if (specificationVersion && implementationVersion) {
          resolve(`${specificationVersion} : ${implementationVersion}`);
        }
      });

      readline.on('error', (err) => {
        reject(err);
      });
    });

    return promise;
  }

  /**
   * Get the version file
   */
   public getVersionFile(): string {
    const filePath = join(__dirname, this.relativePathToBase);
    const files = readdirSync(filePath);
    for(const file of files) {
      if (file.includes(VERSION_FILE_PREFIX)) {
        return resolve(join(filePath, file));
      }
    }
  }
}
