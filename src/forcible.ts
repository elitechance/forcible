import { Flow } from './flow/flow';
import { FlowConfig } from './flow/flow-config';
import { Rest } from './rest/rest';

export class Forcible {
  private _flow: Flow;
  get flow(): Flow {
    return this._flow;
  }

  private _rest: Rest;
  get rest() {
    if (!this._rest && this._flow) {
      this._rest = new Rest(this._flow);
      return this._rest;
    }
    return this._rest;
  }

  get version() {
    const packageJson = require(__dirname + '/package.json');
    return packageJson.version;
  }

  setConfig(flowConfig: FlowConfig) {
    if (!this._flow) {
      this._flow = new Flow(flowConfig);
    } else {
      this._flow.config = flowConfig;
    }
  }
}
