import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

import './appMenu.css';

import PlayerSearch from '../PlayerSearch/PlayerSearch.js';

function handleItemClick(item) {
  this.setState({ activeItem: item });
}

function renderLink(activeItem, index, link, menuItem, app) {
  return (
    <Link
      className={`menu-item${activeItem === index ? '-active' : ''}`}
      onClick={handleItemClick.bind(app, index)}
      to={`${link}`}>
      {menuItem}
    </Link>
  );
}

const AppMenu = props => {
  return (
    <nav className='app-menu'>
      {renderLink(props.activeItem, 0, props.links[0], props.menuItems[0], props.app)}
      {renderLink(props.activeItem, 2, props.links[2], props.menuItems[2], props.app)}
      <div className='player-search'>
        <PlayerSearch />
      </div>
    </nav>
  );
};

AppMenu.propTypes = {
  activeItem: PropTypes.number,
  app: PropTypes.object,
  links: PropTypes.array,
  menuItems: PropTypes.array
};

export default AppMenu;
