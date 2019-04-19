import BaseDataAccess from './baseDataAccess';

export default class LightningNodeData extends BaseDataAccess {
  connection: any;
  constructor() {
    const name = 'lightning_node';
    const columns = [
      'public_key',
      'ip_address',
      'network',
      'alias',
      'latitude',
      'longitude',
    ];
    super(name, columns, columns);
  }
}
