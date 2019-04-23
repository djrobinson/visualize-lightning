import { LightningNode as LightningNodeType } from '@radar/lnrpc';
import axios from 'axios';
import IpGeoLookup from '../../objects/IpGeoLookup';

export class IpStack {
  private static baseUrl = 'http://api.ipstack.com';

  // TODO: GET A TYPE FOR THE IP RETURNS
  public static async gatherIpAddresses(ipList: string[]): Promise<any> {
    const ipExistsList = await ipList.map(async ip => {
      const existingRecord = await IpGeoLookup.selectByIp(ip);
      if (existingRecord && existingRecord.length) {
        return null;
      }
      return ip;
    });
    const resolvedIps = await Promise.all(ipExistsList);
    const callList = resolvedIps.reduce((acc: any, ip) => {
      if (!!ip) {
        acc.push(this.getSingleIpLocation(ip));
      }
      return acc;
    }, []);
    const calls = await callList;
    return axios.all(calls);
  }

  public static async getSingleIpLocation(ipAddress: string): Promise<any> {
    const apiKey = process.env.IPSTACK_API_KEY;
    return axios.get(`${this.baseUrl}/${ipAddress}?access_key=${apiKey}`);
  }
}
