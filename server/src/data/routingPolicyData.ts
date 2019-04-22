import BaseDataAccess from './baseDataAccess';

export default class ChannelEdgeData extends BaseDataAccess {
  connection: any;
  constructor() {
    const name = 'channel_edges';
    const columns = [
      'policy_id',
      'policy_owner_public_key',
      'time_lock_delta',
      'min_htlc',
      'fee_base_msat',
      'fee_rate_milli_msat',
      'disabled',
      'max_htlc_msat',
    ];
    const uniqueIdentifier = 'id';
    super(name, columns, columns, uniqueIdentifier);
  }
}
