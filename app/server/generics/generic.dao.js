var appConfig = require('./../app.config');
var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise,
    schema: appConfig.schemas
};

var pgp = require('pg-promise')(options);
var db = pgp(appConfig.connectionString);


class GenericDAO {
    constructor() {
        this.tableName = '';
        this.orderFields = '';

        this.records = [];
        this.fields = [];

        this.getRecords = this.getRecords.bind(this);
        this.getRecord = this.getRecord.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);

        this.getFieldsIdx = this.getFieldsIdx.bind(this);
    }

    getFieldsIdx(fields) {
        let fieldsIdx = '';

        for (let i = 1; i <= fields.length; i++) {
            if (fieldsIdx !== '') {
                fieldsIdx += ',';
            }

            fieldsIdx += '$' + i;
        }

        return fieldsIdx;
    }

    async filterToString(filters) {
        let filtersObj = JSON.parse(filters);

        let filtro = '';

        for (let i in filtersObj.criterias) {
            let criteria = filtersObj.criterias[i];

            if (filtro === '') {
                filtro = 'where ';
            } else {
                filtro += ' and ';
            }

            switch (criteria.fieldtype) {
                case 'string':
                    filtro += `lower(${criteria.field}) like lower('%${criteria.value}%')`;
                    break;

                default:
                    if(criteria.value === null){
                        filtro += `${criteria.field} is ${criteria.value}`;
                    } else {
                        filtro += `${criteria.field} = '${criteria.value}'`;
                    }
                    break;
            }
        }

        return filtro;
    }

    async select(options) {
        try {
            let { fields, where, orderBy, groupBy, join } = options;

            if(fields === undefined || fields === '') {
                fields = '*';
            }

            let comando = `select ${fields} from ${this.tableName}`;

            if (join !== undefined && join !== ''){
                comando = `${comando} ${join}`;
            }

            if (where !== undefined && where !== ''){
                comando = `${comando} where ${where}`;
            }

            if (groupBy !== undefined && groupBy !== ''){
                comando = `${comando} group by ${groupBy}`;
            }

            if (orderBy !== undefined && orderBy !== ''){
                comando = `${comando} order by ${orderBy}`;
            }

            console.log('Executando comando: ', comando);
            
            const data = await db.any(comando);

            return data;
        } catch (e) {
            console.log(e);

            return null;
        }
    }

    async getRecords(filters, fields) {
        try {
            const selectFields = (fields !== undefined && fields !== '') ? fields : '*';
            const filtro = await this.filterToString(filters);
            let comando = `select ${selectFields} from ${this.tableName} ${filtro}`;

            if (this.orderFields != ''){
                comando = `${comando} order by ${this.orderFields}`;
            } else {
                comando = `${comando} order by id`;
            }

            console.log('Executando comando: ', comando);
            
            const data = await db.any(comando);

            return {
                code: 200,
                data: data,
                message: `Registros de ${this.tableName}`
            };
        } catch (e) {
            console.log(e);

            return {
                code: 500,
                message: e.toString()
            }
        }
    }

    async getRecord(id, fields) {
        let filters = { criterias: [{ field: "id", value: id, fieldtype: "integer" }] }
        return await this.getRecords(JSON.stringify(filters), fields);
    }

    async extractFieldsValues(record) {
        let fields = Object.getOwnPropertyNames(record);
        let values = [];

        for (var i = 0; i < fields.length; i++) {
            values.push(record[fields[i]]);
        }

        return {fields, values};
    }

    async add(record) {
        let {fields, values} = await this.extractFieldsValues(record);
        let fieldsIdx = this.getFieldsIdx(fields);

        return await db.one(`INSERT INTO ${this.tableName} (${fields}) VALUES(${fieldsIdx}) RETURNING id`, values, event => event.id)
            .then((id) => {
                // success;
                return id;
            })
            .catch(error => {
                // error;
                console.log(error);

                return false;
            });
    }

    async update(id, record) {
        let {fields, values} = await this.extractFieldsValues(record);
        let updateFields = '';

        for (let i = 0; i < fields.length; i++){
            if (updateFields !== '') {
                updateFields += ', ';    
            }

            updateFields +=  `${fields[i]} = $${i+1}`;
        }

        return await db.none(`UPDATE ${this.tableName} SET ${updateFields} where id = ${id}`, values)
            .then(() => {
                // success;
                return true;
            })
            .catch(error => {
                // error;
                console.log(error);

                return false;
            });
    }

    async delete(id) {
        return await db.none(`DELETE FROM ${this.tableName} where id = ${id}`)
            .then(() => {
                // success;
                return true;
            })
            .catch(error => {
                // error;
                console.log(error);

                return false;
            });
    }
}

module.exports = GenericDAO;