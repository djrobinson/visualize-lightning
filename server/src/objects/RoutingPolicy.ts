import RoutingPolicyData from '../data/routingPolicyData';

export default class RoutingPolicy {
  policyId: string;
  policyOwnerPublicKey: string;
  timeLockDelta: number;
  minHtlc: string;
  feeBaseMsat: string;
  feeRateMilliMsat: string;
  disabled: boolean;
  maxHtlcMsat: string;

  constructor(channelId: string = null) {
    this.policyId = channelId;
    if (channelId) {
      const data = new RoutingPolicyData();
      const result = data.selectById(channelId);
      console.log('What is result', result);
    }
  }

  insertIntoDb() {
    const data = new RoutingPolicyData();
    data.insert(this);
  }

  upsertRecord() {
    const data = new RoutingPolicyData();
    data.upsert(this);
  }
}
