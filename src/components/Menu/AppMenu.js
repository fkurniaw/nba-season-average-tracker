import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

import './appMenu.css';

import PlayerSearch from '../PlayerSearch/PlayerSearch.js';

function handleItemClick(item) {
  this.setState({ activeItem: item });
}

function renderLink(props, index) {
  return (
    <Link
      to={`/${props.links[index]}`}
      replace
      className={`menu-item${props.activeItem === index ? '-active' : ''}`}
      onClick={handleItemClick.bind(props.app, index)}>
      {props.menuItems[index]}
    </Link>
  );
}

const AppMenu = props => {
  return (
    <nav className='app-menu'>
      {renderLink(props, 0)}
      {renderLink(props, 2)}
      <div className='player-search'>
        <PlayerSearch />
      </div>
    </nav>
  );
};

AppMenu.propTypes = {
  activeItem: PropTypes.number,
  app: PropTypes.object,
  baseUrl: PropTypes.string,
  links: PropTypes.array,
  menuItems: PropTypes.array
};

renderLink.propTypes = {
  activeItem: PropTypes.number,
  app: PropTypes.object,
  baseUrl: PropTypes.string,
  links: PropTypes.array,
  menuItems: PropTypes.array
};

export default AppMenu;
