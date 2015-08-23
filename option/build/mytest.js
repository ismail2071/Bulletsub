var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem =ReactBootstrap.NavItem;



const navbarInstance = (
  <Navbar brand={<a href="#">BulletSub</a>}>
    <Nav>
      <NavItem eventKey={1} href='#'>Q&A</NavItem>
      <NavItem eventKey={2} href='#'>Comment History</NavItem>
      <NavItem eventKey={2} href='#'>About us</NavItem>
      <NavItem eventKey={2} href='#'>Help us</NavItem>
    </Nav>
  </Navbar>
);



React.render(navbarInstance, document.getElementById('test'));