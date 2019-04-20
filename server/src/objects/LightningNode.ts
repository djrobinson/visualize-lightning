import LightningNodeData from '../data/LightningNodeData';

class LightningNode {
  publicKey: string;
  ipAddress: string;
  network: string;
  alias: string;
  latitude: string;
  longitude: string;
  constructor(publicKey: string = null, ipAddress: string = null) {
    this.publicKey = publicKey;
    this.ipAddress = ipAddress;
    if (publicKey) {
      const data = new LightningNodeData();
      const resutl = data.selectById(publicKey);
      console.log('What is data');
    }
  }

  insertIntoDb() {
    const data = new LightningNodeData();
    data.insert(this);
  }
}

export default LightningNode;
