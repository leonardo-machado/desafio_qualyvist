GenericDAO = require('../../generics/generic.dao');

class SubdominioDAO extends GenericDAO {
    constructor(){
        super();

        this.tableName = 'subdominios_reservados';
    }
}

module.exports = new SubdominioDAO();