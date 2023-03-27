import {NavDropdown} from "react-bootstrap";


const BaseNavDropdown = ({title, children, ...props}) => {
    return (
        <NavDropdown
            ref={props.ref}
            title={title}
            menuVariant="dark" drop={props.drop}
            show={props.show}
            onClick={() => props.setShow(!props.show)}
            onBlur={() => props.setShow(false)}
            onMouseEnter={() => props.setShow(true)}
            onMouseLeave={() => props.setShow(false)}>
            {children}
        </NavDropdown>
    );
}

export default BaseNavDropdown;