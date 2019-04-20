import BaseDataAccess from './baseDataAccess';

export default class LightningNodeData extends BaseDataAccess {
  connection: any;
  constructor() {
    const name = 'lightning_nodes';
    const columns = [
      'public_key',
      'ip_address',
      'network',
      'alias',
      'latitude',
      'longitude',
    ];
    const uniqueIdentifier = 'public_key';
    super(name, columns, columns, uniqueIdentifier);
  }
}
