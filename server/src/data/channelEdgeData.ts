import knex from '../../db/knex';
import BaseDataAccess from './baseDataAccess';

export default class ChannelEdgeData extends BaseDataAccess {
  connection: any;
  constructor() {
    const name = 'channel_edges';
    const columns = [
      'channel_id',
      'channel_point',
      'last_update',
      'node1_pub',
      'node2_pub',
      'capacity',
    ];
    const uniqueIdentifier = 'channel_id';
    super(name, columns, columns, uniqueIdentifier);
  }

  public async selectArcs(publicKey: string) {
    const res = await knex
      .select(
        'c.channel_id',
        'c.channel_point',
        'c.last_update',
        'c.node1_pub',
        'c.node2_pub',
        'c.capacity',
        'l1.public_key AS node1_public_key',
        'l1.ip_address AS node1_ip_address',
        'l1.alias AS node1_alias',
        'l1.color AS node1_color',
        'l2.public_key AS node1_public_key',
        'l2.ip_address AS node1_ip_address',
        'l2.alias AS node1_alias',
        'l2.color AS node1_color',
        'i1.ip AS node1_ip',
        'i1.type AS node1_type',
        'i1.continent_code AS node1_continent_code',
        'i1.continent_name AS node1_continent_name',
        'i1.country_code AS node1_country_code',
        'i1.country_name AS node1_country_name',
        'i1.region_code AS node1_region_code',
        'i1.region_name AS node1_region_name',
        'i1.city AS node1_city',
        'i1.zip AS node1_zip',
        'i1.latitude AS node1_latitude',
        'i1.longitude AS node1_longitude',
        'i1.country_flag AS node1_country_flag',
        'i1.country_flag_emoji AS node1_country_flag_emoji',
        'i2.ip AS node2_ip',
        'i2.type AS node2_type',
        'i2.continent_code AS node2_continent_code',
        'i2.continent_name AS node2_continent_name',
        'i2.country_code AS node2_country_code',
        'i2.country_name AS node2_country_name',
        'i2.region_code AS node2_region_code',
        'i2.region_name AS node2_region_name',
        'i2.city AS node2_city',
        'i2.zip AS node2_zip',
        'i2.latitude AS node2_latitude',
        'i2.longitude AS node2_longitude',
        'i2.country_flag AS node2_country_flag',
        'i2.country_flag_emoji AS node2_country_flag_emoji',
      )
      .from('channel_edges AS c')
      .leftJoin('lightning_nodes AS l1', 'l1.public_key', 'c.node1_pub')
      .leftJoin('lightning_nodes AS l2', 'l2.public_key', 'c.node2_pub')
      .leftJoin('ip_geo_lookup as i1', 'i1.ip', 'l1.ip_address')
      .leftJoin('ip_geo_lookup as i2', 'i2.ip', 'l2.ip_address')
      .where('l1.public_key', publicKey)
      .orWhere('l2.public_key', publicKey);

    return res;
  }
}
