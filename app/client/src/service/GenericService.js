import {appConfig} from './../app.config';
import Utils from './../utils/Utils';

class GenericService {

    getRecords(filters) {
        let opt = { method: 'GET' };
        let url = `${appConfig.URL_SERVER}${this.apiEndPoint}`;

        if (filters !== undefined && filters !== null) {
            url = url + '?filters=' + JSON.stringify(filters);
        }

        fetch(url, opt).then(response => {
            response.json().then(function (json) {
                this.setState({ dataTableValue: json.data });
            }.bind(this));


        }).catch(error => {
            console.log('ERROR: ' + error.message);
        });
    }

    async saveRecords() {
        await this.onBeforeSave();

        await this.messages.clear();
        let msgs = this.validate();

        if (msgs === '') {
            let url = `${appConfig.URL_SERVER}${this.apiEndPoint}`;
            let method = "POST";

            if (this.state.status === "edit") {
                url = `${appConfig.URL_SERVER}${this.apiEndPoint}/${this.state.currentRecord.id}`;
                method = "PUT";
            }

            let opt = {
                method: method,
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state.currentRecord)
            };

            fetch(url, opt).then(response => {
                response.json().then(function (json) {
                    if (json.status === 200) {
                        this.show({ severity: 'success', summary: 'Successo', detail: json.message });

                        this.getRecords();

                        this.setState({ status: "browse", currentRecord: Utils.clone(this.newRecord) });
                    } else {
                        this.show({ severity: 'warn', summary: 'Aviso', detail: json.message });
                    }
                }.bind(this));
            }).catch(error => {
                this.show({ severity: 'error', summary: 'Erro', detail: error.message });

                console.log('ERROR: ' + error.message);
            });
        } else {
            this.validateMessages = [];

            let lines = msgs.split('\n').map((item, i) => {
                return <span>{item}<br /></span>;
            });

            this.validateMessages.push({ severity: 'error', sticky: true, summary: '', detail: <span style={{ display: 'inline-block' }}>{lines}</span> });

            this.messages.show(this.validateMessages);
        }
    }
}
export default new GenericService();