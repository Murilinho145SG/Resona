import "./css/navbar.css"
import logo from "./assets/resona.png"

function objNav(id, text) {
  return (
    <li><a href={`#${id}`}>{text}</a></li>
  )
}

function Navbar() {
  return (
    <div className="navbar">
      <img src={logo} alt="Logo" />
      <ul className="nav-list">
        {objNav("home", "Home")}
        {objNav("about", "About")}
        {objNav("support", "Support")}
      </ul>
    </div>
  );
}

export default Navbar;
