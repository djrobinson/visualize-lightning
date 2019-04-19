import knex from '../../db/knex';

export default class LightningNodeData {
  connection: any;
  constructor() {
    console.log('Creating Lightning Node');
    this.connection = knex('shows');
  }
}
