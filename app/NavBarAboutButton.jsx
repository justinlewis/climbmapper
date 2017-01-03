
import React from 'react';

class NavBarAboutButton extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
	     <li className="active" data-toggle="modal" data-target="#about-modal"><a href="#">About</a></li>
    );
  }

}

export default NavBarAboutButton;
