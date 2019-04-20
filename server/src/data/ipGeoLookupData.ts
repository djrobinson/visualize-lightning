import BaseDataAccess from './baseDataAccess';

export default class IpGeoLookupData extends BaseDataAccess {
  connection: any;
  constructor() {
    const name = 'ip_geo_lookup';
    const columns = [
      'ip',
      'type',
      'continent_code',
      'continent_name',
      'country_code',
      'country_name',
      'region_code',
      'region_name',
      'city',
      'zip',
      'latitude',
      'longitude',
      'country_flag',
      'country_flag_emoji',
    ];
    const uniqueIdentifier = 'ip';
    super(name, columns, columns, uniqueIdentifier);
  }
}
