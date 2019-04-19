import knex from '../../db/knex';

export default class ChannelEdgeData {
  connection: any;
  constructor() {
    console.log('Creating Lightning Node');
    this.connection = knex('shows');
  }
}
