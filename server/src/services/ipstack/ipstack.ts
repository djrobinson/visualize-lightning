import { LightningNode as LightningNodeType } from '@radar/lnrpc';
import axios from 'axios';

export class IpStack {
  private static baseUrl = 'http://api.ipstack.com';

  // TODO: GET A TYPE FOR THE IP RETURNS
  public static async gatherIpAddresses(
    nodes: LightningNodeType[],
  ): Promise<any> {
    const i = 0;
    const accIndex = 0;
    const ipList = nodes.reduce((acc, node) => {
      acc.push(node.addresses[0].addr);
      return acc;
    }, []);
    const callList = ipList.map(ip => this.getSingleIpLocation(ip));
    return axios.all(callList);
  }

  public static async getSingleIpLocation(ipAddress: string): Promise<any> {
    const apiKey = process.env.IPSTACK_API_KEY;
    return axios.get(`${this.baseUrl}/${ipAddress}?access_key=${apiKey}`);
  }
}
