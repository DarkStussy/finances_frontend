import {Form} from "react-bootstrap";


const PasswordInput = (props) => {
    return (
        <Form.Group className="mb-4" controlId="formBasicPassword">
            <Form.Control onChange={props.onChange}
                          type="password" name="password" placeholder="Password" maxLength={32} required/>
            {props.password_text}
        </Form.Group>
    );
}

export default PasswordInput;
