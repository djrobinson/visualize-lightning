import BaseDataAccess from './baseDataAccess';

export default class RoutingPolicyData extends BaseDataAccess {
  connection: any;
  constructor() {
    const name = 'routing_policies';
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
    const uniqueIdentifier = 'policy_id';
    super(name, columns, columns, uniqueIdentifier);
  }
}
