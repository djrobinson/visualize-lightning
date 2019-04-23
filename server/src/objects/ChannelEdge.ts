import ChannelEdgeData from '../data/channelEdgeData';

export default class ChannelEdge {
  channelId: string;
  channelPoint: string;
  lastUpdate: number;
  node1Pub: string;
  node2Pub: string;
  capacity: string;

  constructor(channelId: string = null) {
    this.channelId = channelId;
    if (channelId) {
      const data = new ChannelEdgeData();
      const result = data.selectById(channelId);
      console.log('What is result', result);
    }
  }

  insertIntoDb() {
    const data = new ChannelEdgeData();
    data.insert(this);
  }

  upsertRecord() {
    const data = new ChannelEdgeData();
    data.upsert(this);
  }

  public static async getActiveArcs(publicKey: string) {
    const data = new ChannelEdgeData();
    const res = await data.selectArcs(publicKey);
    return res;
  }
}
