import SignUpForm from "../components/forms/sign_up_form";
import {Container} from "react-bootstrap";


const SignUp = () => {
    return (
        <Container className="p-5 text-center">
            <h2>Please sign up</h2>
            <SignUpForm/>
        </Container>
    );
};

export default SignUp;