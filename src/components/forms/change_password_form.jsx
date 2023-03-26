import PasswordInput from "../inputs/password";
import {Button, Form} from "react-bootstrap";
import ConfirmPasswordInput from "../inputs/confirm_password";
import {useState} from "react";
import {errorInput, passwordPattern} from "./sign_up_form";
import {getInputChangeFunc} from "../../functions/input_change";
import {apiUrl} from "../../App";
import BaseAlert from "../alert";

const ChangePasswordForm = (props) => {
    const password_text = <Form.Text className="text-white">
        <p className="mt-2">1. At least one digit</p>
        <p>2. At least one lowercase character</p>
        <p>3. At least one uppercase character</p>
        <p>4. At least one special character (#?!@$%^&*-)</p>
        <p>5. At least 8 characters in length, but no more than 32.</p>
    </Form.Text>

    let [input, setInput] = useState({
        password: "", confirm_password: ""
    });
    let [error, setError] = useState({password: "", confirm_password: "", alert: "", msg: ""});

    const validateInput = e => {
        let {name, value} = e.target;
        setError(prevState => {
            const stateObj = {...prevState, [name]: ""};
            switch (name) {
                case "password":
                    if (!value.match(passwordPattern) && value) {
                        stateObj["password"] = "Password doesn't match pattern";
                    } else if (input.confirm_password && value !== input.confirm_password) {
                        stateObj["confirm_password"] = "Password and Confirm Password does not match.";
                    } else {
                        stateObj["confirm_password"] = input.confirm_password ? "" : error.confirm_password;
                    }
                    break;
                case "confirm_password":
                    if (input.password && value !== input.password && value) {
                        stateObj[name] = "Password and Confirm Password does not match.";
                    } else {
                        stateObj["confirm_password"] = input.password ? "" : error.password;
                    }
                    break;
                default:
                    break;
            }
            return stateObj;
        });
    }
    const onSubmit = (e) => {
        e.preventDefault();
        const body = JSON.stringify(
            {
                password: input.password,
            }
        );
        const headers = new Headers({
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": props.accessToken
        });
        const requestOptions = {
            method: 'PUT',
            body: body,
            headers: headers
        };
        fetch(apiUrl + "/user/setpassword", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                const detail = data.detail;
                if (detail === 'OK') {
                    setError({...error, alert: "success", msg: "You have successfully changed your password!"})
                } else {
                    setError({...error, alert: "danger", msg: "An error has occurred"});
                }
                setShow(true);
                setInput({password: "", confirm_password: ""});
            })
            .catch(error => console.log('error', error));
    }

    let [show, setShow] = useState(false);
    const getAlert = () => {
        return <BaseAlert show={show} setShow={setShow} className="mb-3" type={error.alert}
                          alert_text={error.msg}/>;
    }

    const onInputChange = getInputChangeFunc(setInput, validateInput);
    return (
        <>
            {getAlert()}
            <Form onSubmit={onSubmit} className="p-5 m-auto w-50">
                {errorInput(error.password)}
                <PasswordInput value={input.password} onChange={onInputChange} password_text={password_text}/>
                {errorInput(error.confirm_password)}
                <ConfirmPasswordInput value={input.confirm_password} onChange={onInputChange}/>
                <Button className="bg-gradient w-100" variant="primary" type="submit">
                    Change password
                </Button>
            </Form>
        </>
    );
}

export default ChangePasswordForm;