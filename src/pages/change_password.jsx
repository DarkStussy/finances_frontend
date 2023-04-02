import {Container} from "react-bootstrap";

import ChangePasswordForm from "../components/forms/change_password_form";
import Error from "../components/error";

const ChangePassword = (props) => {
    if (!props.accessToken)
        return <Error text="Not authorizated"/>

    return (
        <Container className="text-center">
            <ChangePasswordForm accessToken={props.accessToken}/>
        </Container>
    );
};

export default ChangePassword;