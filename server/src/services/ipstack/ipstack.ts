import { LightningNode as LightningNodeType } from '@radar/lnrpc';
import axios from 'axios';

export class IpStack {
  private static baseUrl = 'http://api.ipstack.com';

  // TODO: GET A TYPE FOR THE IP RETURNS
  public static async gatherIpAddresses(
    nodes: LightningNodeType[],
  ): Promise<any> {
    console.log(`What are nodes: ${nodes}`);
    let i = 0;
    let accIndex = 0;
    const batchedIps = nodes.reduce((acc, node) => {
      if (i === 0) {
        acc.push([node.addresses[0].addr]);
        i++;
      } else if (i < 49) {
        i++;
        acc[accIndex].push(node.addresses[0].addr);
      } else {
        acc[accIndex].push(node.addresses[0].addr);
        i = 0;
        accIndex++;
      }
      return acc;
    }, []);
    const callList = batchedIps.map(ipList => this.sendIpBatch(ipList));
    return axios.all(callList);
  }

  private static async sendIpBatch(ipAddresses: string[]): Promise<any> {
    const apiKey = process.env.IPSTACK_API_KEY;
    const joinedIps = ipAddresses.join(',');
    return axios.get(`${this.baseUrl}/${joinedIps}?access_key=${apiKey}`);
  }
}
