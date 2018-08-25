import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

import './appMenu.css';

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
        {props.menuItems[0]}
      </Link>
      <Link
        className={`menu-item${props.activeItem === 1 ? '-active' : ''}`}
        onClick={handleItemClick.bind(props.app, 1)}
        to={`/${props.links[1]}`}>
        {props.menuItems[1]}
      </Link>
      <Link
        className={`menu-item${props.activeItem === 2 ? '-active' : ''}`}
        onClick={handleItemClick.bind(props.app, 2)}
        to={`/${props.links[2]}`}>
        {props.menuItems[2]}
      </Link>
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
