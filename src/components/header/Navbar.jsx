import { NavLink } from "react-router-dom";
import NavItem from "./NavItem"
import { IoClose, IoMenu } from "react-icons/io5";

const NavBar = () => {
    return (
        <header className="header">
            <nav className="nav container">
                <NavLink to="/" className="logo">Logo</NavLink>
                <div className="nav-menu" id="nav-menu">
                    <ul className="nav-list">
                        <NavItem to="/" text="Hlavní stránka"></NavItem>
                        <NavItem to="/nova-faktura" text="Vytvořit fakturu"></NavItem>
                        <NavItem to="/moje-dokumenty" text="Moje dokumenty"></NavItem>
                        <NavItem to="/muj-ucet" text="Můj účet"></NavItem>
                        <NavItem to="/kontakt" text="Kontakt"></NavItem>
                    </ul>
                    <div className="nav-close" id="nav-close">
                    <IoClose />
                    </div>
                </div>
                <div className="nav-toggle" id="nav-toggle">
                    <IoMenu />
                </div>
            </nav>
        </header>
    )
}

export default NavBar;