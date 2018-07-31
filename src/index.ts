import { Forcible } from './forcible';
import { Flow } from './flow/flow';
import { FlowConfig } from './flow/flow-config';

export const forcible: Forcible = new Forcible();
export default forcible;
module.exports = forcible;

export let flow: Flow;
export const setConfig = (data: FlowConfig) => {
  forcible.setConfig(data);
};
