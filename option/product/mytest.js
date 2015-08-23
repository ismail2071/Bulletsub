var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem =ReactBootstrap.NavItem;



const navbarInstance = (
  React.createElement(Navbar, {brand: React.createElement("a", {href: "#"}, "BulletSub")}, 
    React.createElement(Nav, null, 
      React.createElement(NavItem, {eventKey: 1, href: "#"}, "Q&A"), 
      React.createElement(NavItem, {eventKey: 2, href: "#"}, "Comment History"), 
      React.createElement(NavItem, {eventKey: 2, href: "#"}, "About us"), 
      React.createElement(NavItem, {eventKey: 2, href: "#"}, "Help us")
    )
  )
);



React.render(navbarInstance, document.getElementById('test'));