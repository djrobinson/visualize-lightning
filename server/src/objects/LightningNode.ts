import LightningNodeData from '../data/LightningNodeData';

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

  insertWhereNotExist() {
    const data = new LightningNodeData();
    const result = data.selectById(this.publicKey);
    if (!result) {
      data.insert(this);
    }
  }
}

export default LightningNode;
