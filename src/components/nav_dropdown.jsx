import {NavDropdown} from "react-bootstrap";


const BaseNavDropdown = ({title, children, ...props}) => {
    return (
        <NavDropdown
            title={title}
            menuVariant="dark" drop={props.drop}
            show={props.show}
            onClick={() => props.setShow(!props.show)}
            onMouseEnter={() => props.setShow(true)}
            onMouseLeave={() => props.setShow(false)}>
            {children}
        </NavDropdown>
    );
}

export default BaseNavDropdown;