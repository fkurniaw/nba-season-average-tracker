import React from 'react';
import { PropTypes } from 'prop-types';

import './appMenu.css';
import { Menu } from 'semantic-ui-react';

function handleItemClick(item) {
  this.setState({ activeItem: item });
}

const AppMenu = props => {
  return (
    <Menu className="App-menu">
      <Menu.Item
        name='Search Player'
        active={props.activeItem === 'Search Player'}
        onClick={handleItemClick.bind(props.app, 'Search Player')}>
        Search Player
      </Menu.Item>
      <Menu.Item
        name='Compare Players'
        active={props.activeItem === 'Compare Players'}
        onClick={handleItemClick.bind(props.app, 'Compare Players')}>
        Compare Players
      </Menu.Item>
      <Menu.Item>
        Blank 3
      </Menu.Item>
    </Menu>
  );
};

AppMenu.propTypes = {
  activeItem: PropTypes.string,
  app: PropTypes.object
};

export default AppMenu;
