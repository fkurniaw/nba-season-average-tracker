import React from 'react';
import { PropTypes } from 'prop-types';

import './appMenu.css';
import { Menu } from 'semantic-ui-react';

const menuItems = ['Home', 'Search Player', 'Compare Players'];

function handleItemClick(item) {
  this.setState({ activeItem: item });
}

const AppMenu = props => {
  return (
    <Menu className="App-menu">
      <Menu.Item
        name={menuItems[0]}
        active={props.activeItem === menuItems[0]}
        onClick={handleItemClick.bind(props.app, menuItems[0])}>
        {menuItems[0]}
      </Menu.Item>
      <Menu.Item
        name={menuItems[1]}
        active={props.activeItem === menuItems[1]}
        onClick={handleItemClick.bind(props.app, menuItems[1])}>
        {menuItems[1]}
      </Menu.Item>
      <Menu.Item
        name={menuItems[2]}
        active={props.activeItem === menuItems[2]}
        onClick={handleItemClick.bind(props.app, menuItems[2])}>
        {menuItems[2]}
      </Menu.Item>
    </Menu>
  );
};

AppMenu.propTypes = {
  activeItem: PropTypes.string,
  app: PropTypes.object
};

export default AppMenu;
