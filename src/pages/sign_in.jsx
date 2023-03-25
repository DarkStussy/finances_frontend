import SignInForm from "../components/forms/sign_in_form";
import {Container} from "react-bootstrap";
import {Link} from "react-router-dom";


const SignIn = (props) => {
    return (
        <Container className="p-5 text-center">
            <h2>Please sign in</h2>
            <SignInForm setAccessToken={props.setAccessToken}/>
            <Link className="text-white" to={"/signup"}>Click here to sign up</Link>
        </Container>
    );
};

export default SignIn;