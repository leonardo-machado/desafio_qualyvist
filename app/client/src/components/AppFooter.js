import React, { Component } from 'react';
import {appConfig} from './../app.config';

export class AppFooter extends Component {

    render() {
        return  (
            <React.Fragment>
                <div className="layout-footer " >
                    <div style={{ 'float': 'left', display: 'inline-block' }}>
                        <img src='assets/images/logo-qualyvist.svg' alt="" width="20" />
                        <span className="footer-text" style={{ 'marginLeft': '5px' }}>QUALYVIST</span>
                    </div>

                    <div style={{ 'float': 'right', display: 'inline-block' }}>
                        <span className="footer-text" style={{ 'marginLeft': '5px' }}>© SegmentoTech - versão: {appConfig.version}</span>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}