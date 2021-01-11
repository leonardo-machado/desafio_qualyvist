class GenericREST {
    constructor() {
        this.service = {};

        this.getRecords = this.getRecords.bind(this);
        this.getRecord = this.getRecord.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getRecords(req, res, next) {
        let filters = req.query.filters;

        if(filters == undefined || filters == null){
            filters = '{}';
        }

        res.json(await this.service.getRecords(filters));
    }

    async getRecord(req, res, next) {
        let id = req.params.id;

        res.json(await this.service.getRecord(id));
    }

    async add(req, res, next) {
        let record = req.body;

        let status = await this.service.add(record);

        res.status(status.code);
        res.json(status);
    }

    async update(req, res, next) {
        let record = req.body;
        let id = req.params.id;

        let status = await this.service.update(id, record);

        res.status(status.code);
        res.json(status);
    }

    async delete(req, res, next) {
        let id = req.params.id;

        let status = await this.service.delete(id);

        res.status(status.code);
        res.json(status);
    }
}

module.exports = GenericREST;