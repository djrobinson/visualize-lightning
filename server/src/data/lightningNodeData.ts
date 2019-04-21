import knex from '../../db/knex';
import BaseDataAccess from './baseDataAccess';

export default class LightningNodeData extends BaseDataAccess {
  connection: any;
  constructor() {
    const name = 'lightning_nodes';
    const columns = ['public_key', 'ip_address', 'alias', 'color'];
    const uniqueIdentifier = 'public_key';
    super(name, columns, columns, uniqueIdentifier);
  }

  public async selectNodesAndEdgesIpOnly() {
    const res = await knex
      .select(
        'l.public_key',
        'l.ip_address',
        'l.alias',
        'l.color',
        'i.ip',
        'i.type',
        'i.continent_code',
        'i.continent_name',
        'i.country_code',
        'i.country_name',
        'i.region_code',
        'i.region_name',
        'i.city',
        'i.zip',
        'i.latitude',
        'i.longitude',
        'i.country_flag',
        'i.country_flag_emoji',
        'c.channel_id',
        'c.channel_point',
        'c.last_update',
        'c.node1_pub',
        'c.node2_pub',
        'c.capacity',
      )
      .from('channel_edges AS c')
      .leftJoin('lightning_nodes AS l', 'l.public_key', 'c.node1_pub')
      .leftJoin('ip_geo_lookup as i', 'i.ip', 'l.ip_address')
      .whereNotNull('l.ip_address');

    return res;
  }
}
