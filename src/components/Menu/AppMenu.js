import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

import './appMenu.css';

const menuItems = ['Home', 'Search Player', 'Compare Players'];

function handleItemClick(item) {
  this.setState({ activeItem: item });
}

const AppMenu = props => {
  return (
    <nav className='app-menu'>
      <Link
        className={`menu-item${props.activeItem === 0 ? '-active' : ''}`}
        onClick={handleItemClick.bind(props.app, 0)}
        to={`/${props.links[0]}`}>
        {menuItems[0]}
      </Link>
      <Link
        className={`menu-item${props.activeItem === 1 ? '-active' : ''}`}
        onClick={handleItemClick.bind(props.app, 1)}
        to={`/${props.links[1]}`}>
        {menuItems[1]}
      </Link>
      <Link
        className={`menu-item${props.activeItem === 2 ? '-active' : ''}`}
        onClick={handleItemClick.bind(props.app, 2)}
        to={`/${props.links[2]}`}>
        {menuItems[2]}
      </Link>
    </nav>
  );
};

AppMenu.propTypes = {
  activeItem: PropTypes.number,
  app: PropTypes.object,
  links: PropTypes.array
};

export default AppMenu;
