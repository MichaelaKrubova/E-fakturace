import { NavLink } from "react-router-dom";
const NavItem = (props) => {
    return (
        <li className="nav-item">
            <NavLink to={props.to} >{props.text}</NavLink>
        </li>
    )
}

export default NavItem;