import util from 'util';
import knex from '../../db/knex';

export default class BaseDataAccess {
  uniqueIdentifier: string;
  insertColumns: string[] = [];
  selectColumns: string[] = [];
  insertColsCamelCase: any;
  selectColsCamelCase: any;
  tableName: string;

  constructor(
    tableName: string,
    insertColumns: string[],
    selectColumns: string[],
    uniqueIdentifier: string,
  ) {
    this.tableName = tableName;
    this.insertColumns = insertColumns;
    this.selectColumns = selectColumns;
    this.uniqueIdentifier = uniqueIdentifier;
    this.insertColsCamelCase = this.colsToCamelCase(insertColumns);
    this.selectColsCamelCase = this.colsToCamelCase(selectColumns);
  }

  public async insert(businessObject: any) {
    const newRecord = this.buildRecord(businessObject);
    const result = await knex(this.tableName)
      .returning(this.uniqueIdentifier)
      .insert(newRecord)
      .return((res: any) => {
        return res;
      });
    return result;
  }

  public async selectById(id: string) {
    const result = await knex(this.tableName)
      .select(this.selectColumns)
      .where(this.uniqueIdentifier, id);
    return result;
  }

  public async upsert(businessObject: any) {
    const newRecord = this.buildRecord(businessObject);

    const insert = knex(this.tableName)
      .insert(newRecord)
      .toString();

    const update = knex(this.tableName)
      .update(newRecord)
      .whereRaw(
        `${this.tableName}.${this.uniqueIdentifier} = '${
          businessObject[this.uniqueIdentifier]
        }'`,
      );
    const query = util.format(
      `%s ON CONFLICT (${this.uniqueIdentifier}) DO UPDATE SET %s`,
      insert.toString(),
      update.toString().replace(/^update\s.*\sset\s/i, ''),
    );

    const result = await knex.raw(query);
    return result;
  }

  private colsToCamelCase(cols: string[]) {
    const camelCaseCols = cols.reduce((acc: any, col) => {
      const colWords = col.split('_');
      const camelCaseWords = colWords.map((word, i) => {
        if (i) {
          const camelCaseWord = word.charAt(0).toUpperCase() + word.slice(1);
          return camelCaseWord;
        }
        return word;
      });
      const bizObjProp = camelCaseWords.join('');
      acc[col] = bizObjProp;
      return acc;
    }, {});
    return camelCaseCols;
  }

  private buildRecord(businessObject: any) {
    const newRecord = this.insertColumns.reduce((acc: any, col) => {
      const bizObjProp = this.insertColsCamelCase[col];
      acc[col] = businessObject[bizObjProp];
      return acc;
    }, {});
    return newRecord;
  }
}
