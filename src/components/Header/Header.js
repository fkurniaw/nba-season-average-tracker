import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './header.css';
import AppMenu from './Menu/AppMenu.js';

class Header extends Component {
  constructor(props) {
    super(props);
    let activeItem;
    for (let i = 0; i < props.links.length; i++) {
      if (window.location.href.indexOf(props.links[i]) > -1) activeItem = i;
    }
    this.state = {
      activeItem
    };
  }
  render() {
    return (
      <header className="App-header">
        <AppMenu activeItem={this.state.activeItem} app={this} baseUrl={this.props.baseUrl} history={this.props.history} links={this.props.links} menuItems={this.props.headerNames}/>
        <div className='App-title-wrapper'>
          <h1 className="App-title">{this.props.headerNames[this.state.activeItem]}</h1>
        </div>
      </header>
    );
  }
};

Header.propTypes = {
  baseUrl: PropTypes.string,
  history: PropTypes.object,
  links: PropTypes.array,
  headerNames: PropTypes.array
};

export default Header;
