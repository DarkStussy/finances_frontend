import {Form} from "react-bootstrap";


const ConfirmPasswordInput = (props) => {
    return (
        <Form.Group className="mb-4" controlId="formBasicPassword">
            <Form.Control onChange={props.onChange} value={props.value}
                          type="password" name="confirm_password" placeholder="Confirm password" maxLength={32}
                          required/>
        </Form.Group>
    );
}

export default ConfirmPasswordInput;