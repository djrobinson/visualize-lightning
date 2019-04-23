import IpGeoLookupData from '../data/ipGeoLookupData';

class IpGeoLookup {
  ip: string;
  type: string;
  continentCode: string;
  continentName: string;
  countryCode: string;
  countryName: string;
  regionCode: string;
  regionName: string;
  city: string;
  zip: string;
  latitude: string;
  longitude: string;
  countryFlag: string;
  countryFlagEmoji: string;

  constructor(ip: string = null) {
    this.ip = ip;
    if (ip) {
      const data = new IpGeoLookupData();
      const result = data.selectById(ip);
      console.log('What is result', result);
    }
  }

  public static async selectByIp(ip: string) {
    const data = new IpGeoLookupData();
    const result = await data.selectById(ip);
    return result;
  }

  upsertRecord() {
    const data = new IpGeoLookupData();
    data.upsert(this);
  }
}

export default IpGeoLookup;
