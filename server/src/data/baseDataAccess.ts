import knex from '../../db/knex';

export default class BaseDataAccess {
  uniqueIdentifier: string;
  insertColumns: string[] = [];
  selectColumns: string[] = [];
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
  }

  insert(businessObject: any) {
    const newRecord = {};
    this.insertColumns.forEach(col => {
      const colWords = col.split('_');
      const camelCaseWords = colWords.map((word, i) => {
        if (i) {
          const camelCaseWord = word.charAt(0).toUpperCase() + word.slice(1);
          return camelCaseWord;
        }
        return word;
      });
      const bizObjProp = camelCaseWords.join('');
      newRecord[col] = businessObject[bizObjProp];
    });
    const insertedRecord = knex(this.tableName)
      .returning(this.uniqueIdentifier)
      .insert(newRecord)
      .then((res: any) => {
        console.log(`${res} was inserted into ${this.tableName}`);
      });
  }

  selectById(id: string) {
    const result = knex(this.tableName)
      .select(this.selectColumns)
      .where(this.uniqueIdentifier, id);
    return result;
  }
}
