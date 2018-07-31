import * as querystring from 'querystring';

import { Flow } from '../flow/flow';
import { HttpClient } from '../http/client';

export class Rest {
  private DEFAULT_SERVICE = '/services/data/v20.0';
  private _flow: Flow;
  private _versions: string[];

  private _servicePath: string;
  set servicePath(path: string) {
    this._servicePath = path;
  }
  get servicePath() {
    return this._servicePath;
  }

  constructor(flow: Flow) {
    this._flow = flow;
    this._servicePath = this.DEFAULT_SERVICE;
  }

  async query(soql: string) {
    const strQuery = querystring.stringify({ q: soql });
    const response = await this.serviceReq(
      this._servicePath + '/query/?' + strQuery
    );
    if (response.statusCode === 200 && response.body) {
      return JSON.parse(response.body);
    }
    return {};
  }

  async getLatestVersion() {
    const versions = await this.getVersions();
    let currentVersion = 0;
    let parseVersion = 0;
    let currentObject: any = { version: '0.0', url: '', label: '' };
    for (const version of versions) {
      parseVersion = parseFloat(version.version);
      if (currentVersion < parseVersion) {
        currentVersion = parseVersion;
        currentObject = version;
      }
    }
    return currentObject;
  }

  async getVersions() {
    try {
      if (this._versions) {
        return this._versions;
      }
      if (this._flow.lastResponse && this._flow.lastResponse.instance_url) {
        const response = await this.serviceReq('/services/data/');
        if (response.body) {
          return JSON.parse(response.body);
        } else {
          return [];
        }
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  private serviceReq(servicePath: string) {
    const tokenType = this._flow.lastResponse.token_type;
    const token = this._flow.lastResponse.access_token;
    const options = {
      headers: { authorization: tokenType + ' ' + token }
    };
    const url = this._flow.lastResponse.instance_url + servicePath;
    return HttpClient.get(url, options);
  }
}
