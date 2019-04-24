import knex from '../../db/knex';
import BaseDataAccess from './baseDataAccess';

export default class RoutingPolicyData extends BaseDataAccess {
  connection: any;
  constructor() {
    const name = 'routing_policies';
    const columns = [
      'policy_id',
      'policy_channel_id',
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

  public async selectByChannelAndPubKey(channelId: string, publicKey: string) {
    const res = await knex
      .select(
        'policy_id',
        'policy_channel_id',
        'policy_owner_public_key',
        'time_lock_delta',
        'min_htlc',
        'fee_base_msat',
        'fee_rate_milli_msat',
        'disabled',
        'max_htlc_msat',
      )
      .from('routing_policies as l')
      .where('policy_owner_public_key', publicKey)
      .andWhere('policy_channel_id', channelId);
    return res;
  }
}
