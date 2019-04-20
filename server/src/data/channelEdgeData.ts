import BaseDataAccess from './baseDataAccess';

export default class ChannelEdgeData extends BaseDataAccess {
  connection: any;
  constructor() {
    const name = 'channel_edges';
    const columns = [
      'channel_id',
      'channel_point',
      'last_update',
      'node1_pub',
      'node2_pub',
      'capacity',
    ];
    const uniqueIdentifier = 'channel_id';
    super(name, columns, columns, uniqueIdentifier);
  }
}
