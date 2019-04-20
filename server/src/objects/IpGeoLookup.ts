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

  public async insertWhereNotExist() {
    const data = new IpGeoLookupData();
    const result = await data.selectById(this.ip);
    if (!result || !result.length) {
      data.insert(this);
    }
  }
}

export default IpGeoLookup;
