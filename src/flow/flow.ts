import { HttpClient } from '../http/client';
import { FlowConfig } from './flow-config';
import { FlowResponse } from './flow-response';

export class Flow {
  lastResponse: FlowResponse;

  private _config: FlowConfig;
  set config(flowConfig: FlowConfig) {
    this._config = flowConfig;
  }
  get config() {
    return this._config;
  }

  private _isAuthenticated: boolean;
  get isAuthenticated() {
    return this._isAuthenticated;
  }

  constructor(config: FlowConfig) {
    this._config = config;
  }

  async usernamePassword(username: string, password: string) {
    const path = this.getBasePath();
    const credentials = {
      grant_type: 'password',
      client_id: this._config.clientId,
      client_secret: this._config.clientSecret,
      username: username,
      password: password
    };
    try {
      const response = await HttpClient.post(path, credentials);
      if (response && response.body) {
        const parseResponse: FlowResponse = JSON.parse(response.body);
        if (parseResponse.error) {
          this._isAuthenticated = false;
        } else {
          this._isAuthenticated = true;
        }
        this.lastResponse = parseResponse;
        return parseResponse;
      } else {
        this._isAuthenticated = false;
        return {};
      }
    } catch (error) {
      this._isAuthenticated = false;
      return error;
    }
  }

  private getBasePath() {
    if (this._config.useSandbox) {
      return 'https://test.salesforce.com/services/oauth2/token';
    }
    return 'https://login.salesforce.com/services/oauth2/token';
  }
}
