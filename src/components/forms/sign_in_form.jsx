import {Button, Form} from "react-bootstrap";
import UsernameInput from "../inputs/username";
import PasswordInput from "../inputs/password";
import {useState} from "react";
import {getInputChangeFunc} from "../../functions/input_change";
import {apiUrl} from "../../App";
import {useNavigate} from "react-router-dom";


const SignInForm = (props) => {
    const [input, setInput] = useState({username: "", password: ""});
    const [error, setError] = useState({detail: ""});
    const onInputChange = getInputChangeFunc(setInput);
    const navigate = useNavigate();
    const onSubmit = (e) => {
        e.preventDefault();
        const body = new FormData();
        body.append("username", input.username);
        body.append("password", input.password);
        const requestParams = {
            method: "POST",
            body: body
        };
        fetch(apiUrl + "/auth/login", requestParams).then((response) => response.json())
            .then((data) => {
                const detail = data["detail"];
                if (detail) {
                    setError({detail: detail});
                } else {
                    const token_type = data["token_type"];
                    const token = data["access_token"];
                    token_type === "bearer" ? props.setAccessToken(`Bearer ${token}`) : props.setAccessToken(token);
                    navigate({pathname: "/"});
                }
            });
    }
    return (
        <Form onSubmit={onSubmit} className="p-4 m-auto form">
            <UsernameInput onChange={onInputChange}/>
            <PasswordInput onChange={onInputChange}/>
            <span className="text-danger small">
                {error.detail}
            </span>
            <Button className="bg-gradient w-100" variant="primary" type="submit">
                Sign in
            </Button>
        </Form>
    );
}

export default SignInForm;