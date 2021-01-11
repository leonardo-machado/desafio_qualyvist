import React, { Component } from 'react';

export class DashboardPage extends Component {

    render() {

        return (
            
            <div className="p-grid p-fluid dashboard">
                
                <div className="p-col-12">
                    <div className="card">
                        <h1>Dashboard</h1>
                        <p>Essa página apresenta algumas informações relevantes do sistema.</p>
                    </div>
                </div>

                <div className="p-col-12 p-lg-4">
                    <div className="card summary">
                        <span className="title">Contas criadas</span>
                        <span className="detail"> </span>
                        <span className="count revenue">100</span>
                    </div>
                </div>

                <div className="p-col-12 p-lg-4">
                    <div className="card summary">
                        <span className="title">Contas Ativas</span>
                        <span className="detail"> </span>
                        <span className="count visitors">75</span>
                    </div>
                </div>
                
                <div className="p-col-12 p-lg-4">
                    <div className="card summary">
                        <span className="title">Contas Inativas</span>
                        <span className="detail"> </span>
                        <span className="count purchases">25</span>
                    </div>
                </div>
            </div>
        );
    }
}