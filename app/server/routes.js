let rest = [];

// ### Início da lista dos módulos.
//
// Registre o Módulo adicionando o caminho do mesmo ao array rest
// Exemplo:
// rest.push('<meu_modulo>/<meu_modulo>.rest');

rest.push('subdominio/subdominio.rest');

// ### Fim da lista dos módulos.

function routes(app){
    console.log("*** Load Routes ***");

    for(index in rest){
        let obj = require('./modules/' + rest[index]);

        obj.registerRoutes(app);
    }
}

module.exports = routes;
