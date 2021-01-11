GenericService = require('../../generics/generic.service');
ContaService = require('../conta/conta.service');

class SubdominioService extends GenericService {
    constructor(){
        super();

        this.dao = require('./subdominio.dao');
    }

    getSubdominio = async (subdominio) => {
        let options = { fields: 'subdominio', where: `subdominio = \'${subdominio}\'`};
        let retornoSubdominios = await this.select(options);
        let retornoConta = await ContaService.select(options);

        let data = [];

        if(retornoSubdominios.code === 200 && retornoConta.code === 200){
            Array.prototype.push.apply(data, retornoSubdominios.data);
            Array.prototype.push.apply(data, retornoConta.data);

            return {
                code: 200,
                data: data,
                message: 'Consulta subdomínios indisponíveis.'
            }
        } else {
            let message = '';

            if(retornoSubdominios.code != 200){
                message = retornoSubdominios.message;
            }

            if(retornoConta.code != 200){
                message = `${message}\n${retornoConta.message}`;
            }

            return {
                code: 500,
                message: message
            }
        }
    }
}

module.exports = new SubdominioService();