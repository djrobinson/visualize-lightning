import RoutingPolicyData from '../data/routingPolicyData';

export default class RoutingPolicy {
  policyId: string;
  policyChannelId: string;
  policyOwnerPublicKey: string;
  timeLockDelta: number;
  minHtlc: string;
  feeBaseMsat: string;
  feeRateMilliMsat: string;
  disabled: boolean;
  maxHtlcMsat: string;

  constructor(policyId: string = null) {
    this.policyId = policyId;
    if (policyId) {
      const data = new RoutingPolicyData();
      const result = data.selectById(policyId);
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

  public static async getByChannelAndPubKey(
    channelId: string,
    publicKey: string,
  ) {
    const data = new RoutingPolicyData();
    const res = await data.selectByChannelAndPubKey(channelId, publicKey);
    return res;
  }
}
