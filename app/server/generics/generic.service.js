class genericService {
    constructor(){
        this.dao = {};

        this.getRecords = this.getRecords.bind(this);
        this.getRecord = this.getRecord.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async select(options) {
        try {
            const data = await this.dao.select(options);

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

    async getRecords(filters, fields) {
        return await this.dao.getRecords(filters, fields);
    }

    async getRecord(id, fields) {
        return await this.dao.getRecord(id, fields);
    }

    async add(record) {
        let id = await this.dao.add(record);
        
        if(id){
            return {code: 200,
                    id: id,
                    message: `Registro criado.`};
        }

        return {code: 500,
                message: "Falha ao criar registro."};
    }

    async update(id, record) {
        if(await this.dao.update(id, record)){
            return {code: 200,
                    message: "Registro alterado."};
        }

        return {code: 500,
                message: "Falha ao alterar registro."};
    }

    async delete(id) {
        if(await this.dao.delete(id)){
            return {code: 200,
                    message: "Registro excluído."};
        }

        return {code: 500,
                message: "Falha ao excluir registro."};
    }
}

module.exports = genericService;