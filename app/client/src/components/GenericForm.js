import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Messages } from 'primereact/messages';
import { appConfig } from './../app.config';

import Utils from './../utils/Utils';
import './GenericForm.css';

class GenericForm extends Component {
    constructor() {
        super();

        this.state = { status: "browse" };
        
        this.state.dataTableValue = [];
        this.state.currentRecord = {};

        this.state.searchInput = '';
        this.state.filteredData = [];
        
        this.state.conteudoPesquisa = { conteudo: "", campo: "" };
        this.state.showPesquisa = true;

        this.formName = '';
        this.apiEndPoint = '';
        this.campos = [];
        
        this.validateMessages = [];
        this.newRecord = {};

        this.onNovoClick = this.onNovoClick.bind(this);
        this.onEditarClick = this.onEditarClick.bind(this);
        this.onExcluirClick = this.onExcluirClick.bind(this);
        this.onExcluirYesClick = this.onExcluirYesClick.bind(this);
        this.onExcluirNoClick = this.onExcluirNoClick.bind(this);
        this.onSalvarClick = this.onSalvarClick.bind(this);
        this.onCancelarClick = this.onCancelarClick.bind(this);

        this.getRecords = this.getRecords.bind(this);
        this.getGridColumns = this.getGridColumns.bind(this);
        this.getCampos = this.getCampos.bind(this);
    }

    /***
     * Métodos abstratos, para implementação dos formulários
     */
    renderFields() { }
    validate() { return ''; }
    onBeforeSave() { }
    resetCampos = async () => { }
    /******/

    showMessage(value, param) { // 
        switch (value) {
            case 'onEditarClick':
                this.messages.show({ severity: 'error', summary: 'Selecione um registro para editar.' });
                break;
            case 'onExcluirClick':
                this.messages.show({ severity: 'error', summary: 'Selecione um registro para exclusão.' });
                break;

            case 'onSalvarClickWarn':
                this.messages.show({ severity: 'warn', summary: `${param}`});
                break;

            case 'onSalvarClickSuccess':
                this.messages.show({ severity: 'success', summary: `${param}`});
                break;

            case 'onSalvarClickError':
                this.messages.show({ severity: 'error', summary: `${param}`});
                break;

            case 'onExcluirYesClickSucess':
                this.messages.show({ severity: 'success', summary:  `${param}`});
                break;

            case 'onExcluirYesClickWarn':
                this.messages.show({ severity: 'warn', summary: `${param}`});
                break;

            case 'onExcluirYesClickError':
                this.messages.show({ severity: 'error', summary: `${param}`});
                break;
            default: 
                this.messages.show({ severity: 'warn', summary: 'Atenção' });
        }
    }

    async getRecords(filters) {
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

    onNovoClick() {
        this.resetCampos();
        this.setState({ status: "new" });
    }

    onEditarClick = async () => {
        if (this.state.currentRecord.id === undefined) {
            this.showMessage('onEditarClick');
        } else {
            this.setState({ status: "edit" });
            let test = await this.state.currentRecord.subdominio;
            this.setState({ subdominoRecordBeforeChange: test });
        }
    }

    onExcluirClick() {
        if (this.state.currentRecord.id === undefined) {
            this.showMessage('onExcluirClick')
        } else {
            this.setState({ displayConfirmExclusao: true });
        }
    }

    onExcluirYesClick() {
        let url = `${appConfig.URL_SERVER}${this.apiEndPoint}/${this.state.currentRecord.id}`;
        let method = "DELETE";

        let opt = { method: method };

        fetch(url, opt).then(response => {
            response.json().then(function (json) {
                if (json.code === 200) {

                    this.showMessage('onExcluirYesClickSucess', json.message);
                    this.getRecords();
                    this.setState({ displayConfirmExclusao: false });
                } else {
                    this.showMessage('onExcluirYesClickWarn', json.message);
                }
            }.bind(this));
        }).catch(error => {
            this.showMessage('onExcluirYesClickError', error.message);
            console.log('ERROR: ' + error.message);
        });
    }

    onExcluirNoClick() {
        this.setState({ displayConfirmExclusao: false });
    }

    async onSalvarClick() {      
        await this.onBeforeSave();

        await this.messages.clear();

        let msgs = await this.validate();

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
                    if (json.code === 200) {
                        this.showMessage('onSalvarClickSuccess', json.message);
                        this.getRecords();
                        this.setState({ status: "browse", currentRecord: Utils.clone(this.newRecord) });
                    } else {
                        this.showMessage('onSalvarClickWarn', json.message);
                    }
                }.bind(this));
            }).catch(error => {

                this.showMessage('onSalvarClickError', error.message);
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

    onCancelarClick() {
        this.messages.clear();
        this.getRecords();
        this.setState({ status: "browse", currentRecord: Utils.clone(this.newRecord) });
    }

    onFieldChange(field, event) {
        let record = this.state.currentRecord;
        record[field] = event.target.value;
        this.setState({ currentRecord: record });
    }

    async onSelectionChange(event) {
        await this.setState({ currentRecord: event.value });
    }

    getCampos(atributo) {
        let campos = this.campos.map((col, i) => {
            if (col[atributo]) {
                return col;
            }

            return null;
        });

        campos = Utils.removeNullElements(campos);

        return campos;
    }

    getGridColumns() {
        let columns = this.getCampos('grid');
        return columns.map((col, i) => {
            return <Column field={col.value} header={col.label} body={col.body} sortable={true} key={i} />;
        });
    }

    handleGlobalSearchChange = event => {
        this.setState({ searchInput: event.target.value }, () => {
          this.globalSearch();
        });
    };
    
    globalSearch = () => {
    };

    render() {
        let showCamposEdit = (this.state.status === "browse") ? "none" : "block";
        let showLista = (this.state.status === "browse") ? "block" : "none";

        let gridColumns = this.getGridColumns();

        const dialogFooter = (
            <div>
                <Button icon="pi pi-times" className="p-button p-button-success" onClick={this.onExcluirNoClick} label="Não" />
                <Button icon="pi pi-check" className="p-button-outlined p-button p-button-danger" onClick={this.onExcluirYesClick} label="Sim" />
            </div>
        );

        const header = (
            <div className="table-header">
                <h1 style={{ marginTop: '0px' }}>Lista de {this.formName}</h1>
                <div className="p-d-flex">
                    <InputText type="search" onChange={this.handleGlobalSearchChange} placeholder="Search..." />
                    <Button icon="pi pi-plus" className="p-button-success" style={{ marginLeft: '.25em', marginRight: '.25rem' }} onClick={this.onNovoClick} tooltip="Novo" tooltipOptions={{ position: 'top' }} />
                    <Button icon="pi pi-pencil" className="p-button-warning" style={{ marginRight: '.25em' }} onClick={this.onEditarClick} tooltip="Editar" tooltipOptions={{ position: 'top' }} />
                    <Button icon="pi pi-trash" className="p-button-danger" onClick={this.onExcluirClick} tooltip="Excluir" tooltipOptions={{ position: 'top' }} />
                </div>
            </div>
        );

        return (
            <div className="p-grid p-fluid">
                <div className="p-col-12">
                    <Messages ref={(el) => this.messages = el}></Messages>
                    {/* EDITAR - Cabeçalho e footer (botões) padronizados e permite a injeção dos campos*/}
                    <div className="card card-w-title" style={{ display: showCamposEdit }}>
                        <h1>Registro de {this.formName}</h1>
                        <div className="p-grid">
                            {/* Carrega os elementos do campo de criar/editar registro */}
                            {this.renderFields()}
                            {/*  */}
                            <div className="p-grid p-col-12">
                                <div className="p-col-12 p-md-3">
                                    <Button id="idBtnSalvar" label="Salvar" className="p-button p-button-success p-button-rounded" icon="pi pi-check" iconPos="right" style={{ marginTop: '1.6em' }} onClick={this.onSalvarClick} />
                                </div>
                                <div className="p-col-12 p-md-3">
                                    <Button id="idBtnCancelar" label="Cancelar" className="p-button-outlined p-button-danger p-button-rounded" icon="pi pi-times" iconPos="right" style={{ marginTop: '1.6em' }} onClick={this.onCancelarClick} />
                                </div>

                            </div>
                        </div>
                    </div>
                    {/* Exibir os itens da tabela*/}
                    <div className="p-datatable-responsive-demo">
                        <div className="card card-w-title" style={{ display: showLista }}>
                            <DataTable
                                className="p-datatable-responsive-demo"
                                value={this.state.filteredData && this.state.filteredData.length ? this.state.filteredData : this.state.dataTableValue}
                                selectionMode="single"
                                paginator={true}
                                rows={10}
                                selection={this.state.currentRecord}
                                onSelectionChange={this.onSelectionChange.bind(this)}
                                header={header}
                            >
                                {/* Carrega os elementos da tabela */}
                                {gridColumns}
                                {/*  */}
                            </DataTable>
                        </div>
                    </div>
                    {/* Modal para exibir confirmação de exclusão */}
                    <div>
                        <Dialog
                            visible={this.state.displayConfirmExclusao}
                            style={{ width: '450px' }}
                            header={<b>Confirmação</b>}
                            modal={true}
                            footer={dialogFooter}
                            onHide={() => this.setState({ displayConfirmExclusao: false })}
                        >
                            <p>Confirma a exclusão do registro?</p>
                        </Dialog>
                    </div>
                </div>
            </div>
        );
    }
}

export default GenericForm;