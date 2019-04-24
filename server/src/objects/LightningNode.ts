import LightningNodeData from '../data/lightningNodeData';

class LightningNode {
  publicKey: string;
  ipAddress: string;
  alias: string;
  color: string;

  constructor(publicKey: string = null, ipAddress: string = null) {
    this.publicKey = publicKey;
    this.ipAddress = ipAddress;
    if (publicKey) {
      const data = new LightningNodeData();
      const result = data.selectById(publicKey);
    }
  }

  insertIntoDb() {
    const data = new LightningNodeData();
    data.insert(this);
  }

  upsertRecord() {
    const data = new LightningNodeData();
    data.upsert(this);
  }

  public static async getNodesIpOnly() {
    const data = new LightningNodeData();
    const res = await data.selectNodesIpOnly();
    return res;
  }

  public static async getNorthPoleNodes() {
    const data = new LightningNodeData();
    const res = await data.selectNorthPoleNodes();
    return res;
  }
}

export default LightningNode;
