import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './header.css';
import AppMenu from '../Menu/AppMenu.js';

class Header extends Component {
  constructor() {
    super();
    this.state = {
      activeItem: 0
    };
  }
  render() {
    return (
      <header className="App-header">
        <AppMenu activeItem={this.state.activeItem} app={this} links={this.props.links}/>
        <div className='App-title-wrapper'>
          <h1 className="App-title">{this.props.headerNames[this.state.activeItem]}</h1>
        </div>
      </header>
    );
  }
};

Header.propTypes = {
  links: PropTypes.array,
  headerNames: PropTypes.array
};

export default Header;
