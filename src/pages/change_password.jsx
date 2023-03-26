import {Container} from "react-bootstrap";

import ChangePasswordForm from "../components/forms/change_password_form";

const ChangePassword = (props) => {
    return (
        <Container className="text-center">
            <ChangePasswordForm accessToken={props.accessToken}/>
        </Container>
    );
};

export default ChangePassword;