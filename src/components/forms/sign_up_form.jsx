import {Button, Form} from "react-bootstrap";
import UsernameInput from "../inputs/username";
import PasswordInput from "../inputs/password";
import {useState} from "react";
import {apiUrl} from "../../App";
import {useNavigate} from "react-router-dom";
import {getInputChangeFunc} from "../../functions/input_change";
import ConfirmPasswordInput from "../inputs/confirm_password";

export const usernamePattern = "\\w{3,32}";
export const passwordPattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$";

export const errorInput = (msg) => {
    return (
        <span id="errorInput" className="text-danger small">
            {msg}
        </span>
    );
}

const SignUpForm = () => {
    const username_text = <Form.Text className="text-white">
        <p className="mt-2">Letters, numbers and _ only, 3 to 32 characters</p></Form.Text>
    const password_text = <Form.Text className="text-white">
        <p className="mt-2">1. At least one digit</p>
        <p>2. At least one lowercase character</p>
        <p>3. At least one uppercase character</p>
        <p>4. At least one special character (#?!@$%^&*-)</p>
        <p>5. At least 8 characters in length, but no more than 32.</p>
    </Form.Text>

    let [input, setInput] = useState({
        username: "", password: "", confirm_password: ""
    });
    let [error, setError] = useState({username: "", password: "", confirm_password: "", detail: ""});

    const validateInput = e => {
        let {name, value} = e.target;
        setError(prevState => {
            const stateObj = {...prevState, [name]: ""};
            switch (name) {
                case "username":
                    if (!value.match(usernamePattern) && value) {
                        stateObj["username"] = "Username doesn't match pattern";
                    }
                    break;
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
    const navigate = useNavigate();
    const onSubmit = (e) => {
        e.preventDefault();
        const body = JSON.stringify(
            {
                username: input.username,
                password: input.password,
            }
        );
        const headers = new Headers({
            "accept": "application/json",
            "Content-Type": "application/json",
        });
        const requestOptions = {
            method: 'POST',
            body: body,
            headers: headers
        };
        fetch(apiUrl + "/user/signup", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                const detail = data.detail;
                if (detail === 'OK') {
                    navigate({pathname: '/login'})
                } else {
                    setError({...error, detail: detail});
                }
            })
            .catch(error => console.log('error', error));
    }

    const onInputChange = getInputChangeFunc(setInput, validateInput);
    return (
        <Form onSubmit={onSubmit} id="signup_form" className="p-5 m-auto w-50">
            {errorInput(error.username)}
            <UsernameInput onChange={onInputChange} username_text={username_text}/>
            {errorInput(error.password)}
            <PasswordInput onChange={onInputChange} password_text={password_text}/>
            {errorInput(error.confirm_password)}
            <ConfirmPasswordInput onChange={onInputChange}/>
            {errorInput(error.detail)}
            <Button className="bg-gradient w-100" variant="primary" type="submit"
                    disabled={!!(error.username || error.password || error.confirm_password)}>
                Sign up
            </Button>
        </Form>
    );
}

export default SignUpForm;