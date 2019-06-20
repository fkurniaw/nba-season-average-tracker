import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './header.css';
import AppMenu from './Menu/AppMenu.js';

class Header extends Component {
    constructor(props) {
        super(props);
        let activeItem;
        props.links.forEach((link, i) => {
            if (window.location.href.indexOf(link) > -1) activeItem = i;
        });
        this.state = {
            activeItem,
        };
    }
    mapUrlToActiveItem() {
        const activeItemMap = {
            Home: 0,
            ComparePlayers: 2,
        };
        const currentPathName = this.props.history.location.pathname.substring(
            1
        );
        return activeItemMap[currentPathName] > -1
            ? activeItemMap[currentPathName]
            : null;
    }
    render() {
        return (
            <div className="header-wrapper">
                <header className="App-header">
                    <AppMenu
                        activeItem={this.mapUrlToActiveItem()}
                        app={this}
                        baseUrl={this.props.baseUrl}
                        history={this.props.history}
                        links={this.props.links}
                        menuItems={this.props.headerNames}
                    />
                    <div className="App-title-wrapper">
                        <h1 className="App-title">
                            {this.props.headerNames[this.mapUrlToActiveItem()]}
                        </h1>
                    </div>
                </header>
            </div>
        );
    }
}

Header.propTypes = {
    baseUrl: PropTypes.string,
    history: PropTypes.object,
    links: PropTypes.array,
    headerNames: PropTypes.array,
};

export default Header;
