import {Form} from "react-bootstrap";


const UsernameInput = (props) => {
    return (
        <Form.Group className="mb-4" controlId="formBasicEmail">
            <Form.Control onChange={props.onChange}
                          type="text" name="username" placeholder="Username" maxLength={32} required/>
            {props.username_text}
        </Form.Group>
    );
}

export default UsernameInput;