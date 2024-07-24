import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import {PublisherUtil} from '../services/publisher_utils.service'
import { environment } from '../../environments/environment';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';


@Injectable()
export class HealthService {
    publisherName: string;
    publisherKey: string;
    refreshToken: string
    apiUrl:string;
    constructor(private readonly publisherUtil: PublisherUtil) {
        this.publisherName = '{Publisher_Name}';
        this.publisherKey = `marin-${this.publisherName}-api-service`;
        this.refreshToken = environment.HEALTH_AUTH_CODE;
        this.apiUrl = "environment.URL"
      }
      
  public async healthCheckL1() {
    try {
        return  {
            [this.publisherKey]: {
              "L1" : {
                "LinkingService" : {
                  "stack" : null,
                  "healthy" : "true",
                  "message" : `${this.publisherName} is up and alive!`,
                }
              },
            }
          }
      } catch (err) {
        throw new HttpException("Heatlh L1 Error", HttpStatus.INTERNAL_SERVER_ERROR)
      }
  }
  
  public async healthCheckL2() {  

    let versionHealth: string = "true";
    let versionmessage: string;
    let apiHealthMessage: string;
    let apiHealth: string;

    try{
      versionmessage = this.check();
    } catch(err){
      versionHealth = "false";
      versionmessage = err.message;
    }
    const startTime = performance.now();
    try {
        /* perform health check via hitting endpoint of publisher api and check whether our 
        app credentials are valid to communicate with publisher api 
        "set status Valid"
        */
      } catch (err) {
    }
    return  {
      [this.publisherKey] : {
       "L2" : {
          "ServiceVersion" : {
              "stack" : null,
              "healthy" : versionHealth,
              "message" : versionmessage
          },
          "PublisherHealthCheck" : {
            "stack" : null,
            "healthy" : apiHealth,
            "message" : apiHealthMessage,
          }
        }
      }
    }
  }

  public healthCheckL3(){
    return {"marin-{Publisher_Name}-api-service" : {"L3" : {}}}
  }

  public async healthCheck() {  
    const responseL1 = await this.healthCheckL1()
    const responseL2 = await this.healthCheckL2()
    const responseL3 = this.healthCheckL3()
    const response = {
      [this.publisherKey]: {
        'L1': responseL1[this.publisherKey]['L1'],
        'L2': responseL2[this.publisherKey]['L2'],
        'L3': responseL3['marin-{Publisher_Name}-api-service']['L3']
      }
    }
    return response;
  }

  private check(): string {
    try {
      return this.checkForArtefact();
    } catch (eArtefact) {
      try {
        return this.checkForGit();
      } catch (eGit) {
        throw new Error(eArtefact.message + ', ' + eGit.message);
      }
    }
  }

  private checkForArtefact(): string {
    const versions = this.extractVersions();
    const specificationVersion = versions.specificationVersion;
    const implementationVersion = versions.implementationVersion;
    if (!specificationVersion) {
      throw new Error('Missing Specification-Version in VERSION file');
    }

    if (!implementationVersion) {
      throw new Error('Missing Implementation-Version in VERSION file');
    }
    return specificationVersion + ' : ' + implementationVersion;
  }

  private extractVersions(): Record<string, unknown> {
    const fileContent = readFileSync(join(process.cwd(), 'VERSION'), 'utf-8');
    return {
      specificationVersion: (fileContent.match(
        /Specification-Version: (.+)\n/
      ) || [])[1],
      implementationVersion: (fileContent.match(
        /Implementation-Version: (.+)\n/
      ) || [])[1],
    };
  }

  private checkForGit(): string {
    const date = this.execCmd('git log -1 -s --format=%cI');
    const hash = this.execCmd('git rev-parse HEAD');
    let branch = this.execCmd('git rev-parse --abbrev-ref HEAD');
    if ('HEAD' === branch) {
      branch = this.execCmd('git describe --exact-match --abbrev=0');
    }
    return `${branch} : ${hash} built at ${
      new Date(date).toISOString().split('T')[0]
    }`;
  }

  private execCmd(cmd: string): string {
    return execSync(cmd).toString('utf-8').replace('\n', '');
  }
}