// Bibliotecas
import React, { Component } from 'react';
import classNames from 'classnames';
import { Route } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import PrimeReact from 'primereact/utils';

// Paginas
import { DashboardPage } from './pages/DashboardPage';

// Components
import { AppTopbar } from './components/AppTopbar';
import { AppFooter } from './components/AppFooter';
import { AppMenu } from './components/AppMenu';

// Estilo
import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import './layout/flags/flags.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './layout/layout.scss';
import './App.scss';

class App extends Component {

    constructor() {
        super();
        this.state = {
            layoutMode: 'static',
            layoutColorMode: 'light',
            staticMenuInactive: false,
            overlayMenuActive: false,
            mobileMenuActive: false,
            inputStyle: 'outlined',
            rippleEffect: false,
        };
        PrimeReact.ripple = false;

        this.onWrapperClick = this.onWrapperClick.bind(this);
        this.onToggleMenu = this.onToggleMenu.bind(this);
        this.onSidebarClick = this.onSidebarClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
        this.onInputStyleChange = this.onInputStyleChange.bind(this);
        this.onRippleEffect = this.onRippleEffect.bind(this);
        this.onLayoutModeChange = this.onLayoutModeChange.bind(this);
        this.onColorModeChange = this.onColorModeChange.bind(this);

        this.createMenu();
    }


    onInputStyleChange(inputStyle) {
        this.setState({ inputStyle: inputStyle });
    }

    onRippleEffect(e) {
        PrimeReact.ripple = e.value;
        this.setState({ rippleEffect: e.value })
    }

    onLayoutModeChange(mode) {
        this.setState({ layoutMode: mode });
    }

    onColorModeChange(mode) {
        this.setState({ layoutColorMode: mode });
    }

    onWrapperClick(event) {
        if (!this.menuClick) {
            this.setState({
                overlayMenuActive: false,
                mobileMenuActive: false
            });
        }

        this.menuClick = false;
    }

    onToggleMenu(event) {
        this.menuClick = true;

        if (this.isDesktop()) {
            if (this.state.layoutMode === 'overlay') {
                this.setState({
                    overlayMenuActive: !this.state.overlayMenuActive
                });
            }
            else if (this.state.layoutMode === 'static') {
                this.setState({
                    staticMenuInactive: !this.state.staticMenuInactive
                });
            }
        }
        else {
            const mobileMenuActive = this.state.mobileMenuActive;
            this.setState({
                mobileMenuActive: !mobileMenuActive
            });
        }
        event.preventDefault();
    }

    onSidebarClick(event) {
        this.menuClick = true;
    }

    onMenuItemClick(event) {
        if (!event.item.items) {
            this.setState({
                overlayMenuActive: false,
                mobileMenuActive: false
            })
        }
    }

    createMenu() {
        this.menu = [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', command: () => { window.location = '#/' } },
            
            { label: 'Contas', icon: 'pi pi-user', command: () => { window.location = '#/contas' } },

            { label: 'Subdomínios Reservados', icon: 'pi pi-list', command: () => { window.location = '#/subdominosReservados' } },
        ]
    }

    addClass(element, className) {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    removeClass(element, className) {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    componentDidUpdate() {
        if (this.state.mobileMenuActive)
            this.addClass(document.body, 'body-overflow-hidden');
        else
            this.removeClass(document.body, 'body-overflow-hidden');
    }

    isSidebarVisible() {
        if (this.isDesktop()) {
            if (this.state.layoutMode === 'static')
                return !this.state.staticMenuInactive;
            else if (this.state.layoutMode === 'overlay')
                return this.state.overlayMenuActive;
            else
                return true;
        }
        else {
            return true;
        }
    }

    render() {
        const logo = 'assets/images/logo-qualyvist.svg';

        const wrapperClass = classNames('layout-wrapper', {
            'layout-overlay': this.state.layoutMode === 'overlay',
            'layout-static': this.state.layoutMode === 'static',
            'layout-static-sidebar-inactive': this.state.staticMenuInactive && this.state.layoutMode === 'static',
            'layout-overlay-sidebar-active': this.state.overlayMenuActive && this.state.layoutMode === 'overlay',
            'layout-mobile-sidebar-active': this.state.mobileMenuActive,
            'p-input-filled': this.state.inputStyle === 'filled',
            'p-ripple-disabled': this.state.rippleEffect === false
        });

        const sidebarClassName = classNames("layout-sidebar", {
            'layout-sidebar-dark': this.state.layoutColorMode === 'dark',
            'layout-sidebar-light': this.state.layoutColorMode === 'light'
        });

        return (
            <div className={wrapperClass} onClick={this.onWrapperClick}>
                <AppTopbar onToggleMenu={this.onToggleMenu} />

                <CSSTransition classNames="layout-sidebar" timeout={{ enter: 200, exit: 200 }} in={this.isSidebarVisible()} unmountOnExit>
                    <div ref={(el) => this.sidebar = el} className={sidebarClassName} onClick={this.onSidebarClick}>
                        
                        <div className="layout-logo">
                            <div className="p-d-inline-flex" style={{'marginBottom': '24px'}}>
                            <img alt="Logo" src={logo} width="50"/>
                            <h5 style={{'marginLeft': '5px'}}> QUALYVIST </h5>
                            </div>
                        </div>
                      
                        {/* <AppProfile /> */}
                        <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} />
                    </div>
                </CSSTransition>

                <div className="layout-main">
                    <Route path="/" exact component={DashboardPage} />
                    {/*<Route path="/contas" component={ContasPage} />*/}
                </div>

                <AppFooter />

                <div className="layout-mask"></div>
            </div>
        );
    }
}

export default App;
