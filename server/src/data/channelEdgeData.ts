import BaseDataAccess from './baseDataAccess';

export default class ChannelEdgeData extends BaseDataAccess {
  connection: any;
  constructor() {
    const name = 'channel_edge';
    const columns = [
      'channel_id',
      'channel_point',
      'last_update',
      'node1_pub',
      'node2_pub',
      'capacity',
    ];
    super(name, columns, columns);
  }
}
