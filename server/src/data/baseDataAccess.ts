import knex from '../../db/knex';

export default class BaseDataAccess {
  connection: any;
  insertColumns: string[] = [];
  selectColumns: string[] = [];

  constructor(
    tableName: string,
    insertColumns: string[],
    selectColumns: string[],
  ) {
    this.connection = knex(tableName);
    this.insertColumns = insertColumns;
    this.selectColumns = selectColumns;
  }

  insertIntoTable() {
    const thisObject = Object.assign({}, this);
    this.connection.insert(thisObject);
  }
}
