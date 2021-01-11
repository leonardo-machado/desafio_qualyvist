import {appConfig} from './../app.config';
// import Utils from './../utils/Utils';

class SubdomniosReservadosService {

    getSubdominio = async (subdominio) => {

        if (subdominio === undefined || subdominio === null || subdominio === '') {
            return false;
        } else {
            let opt = {
                method: 'GET',
                mode: 'cors',
                chache: 'default'
            };

            let url_subdominio_utilizados = `${appConfig.URL_SERVER}subdominio/utilizados/${subdominio}`;
            
            let subdominioUtilizadosSize = await fetch(url_subdominio_utilizados, opt)
                .then(response => {
                    return response.json()
                        .then(data => {
                            return Object.keys(data.data).length;
                        })
                })
                .catch(error => {
                    console.log('ERROR: ' + error.message);
                });

            if (subdominioUtilizadosSize > 0) {
                return false;
            } else {
                return true;
            }
        }
    }
}

export default new SubdomniosReservadosService();