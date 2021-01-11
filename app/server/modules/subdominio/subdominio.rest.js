const appConfig = require('../../app.config');
GenericREST = require('../../generics/generic.rest');


class SubdominioREST extends GenericREST{
    constructor() {
        super();

        this.service = require('./subdominio.service');
    }

    registerRoutes(app) {
        console.log('*** Rotas para Subdominio ***');
        
        let url = `${appConfig.rootAPI}/subdominio`;

        console.log(`***   GET ${url}`);
        app.get(`${url}`, this.getRecords);

        console.log(`***   GET ${url}/:id`);
        app.get(`${url}/:id`, this.getRecord);

        console.log(`***   GET ${url}/utilizados/:subdominio`);
        app.get(`${url}/utilizados/:subdominio`, this.getSubdominio);
 
        console.log(`***   POST ${url}`);
        app.post(`${url}`, this.add);

        console.log(`***   PUT ${url}/:id`);
        app.put(`${url}/:id`, this.update);

        console.log(`***   DELETE ${url}/:id`);
        app.delete(`${url}/:id`, this.delete);

    }

    getSubdominio = async(req, res, next) => {
        let subdominio = req.params.subdominio;

        let retorno = await this.service.getSubdominio(subdominio);
        res.status(retorno.code);
        res.json(retorno);
    }
}

module.exports = new SubdominioREST();