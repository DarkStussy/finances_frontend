import {Container} from "react-bootstrap";


const Error = (props) => {
    return (
        <Container className="text-center">
            <h2 className="p-5 text-danger">An error has occurred!</h2>
            <h5 className="font-weight-bold">Error details:</h5>
            <p className="mt-2">{props.text}</p>
        </Container>
    );
}

export default Error;
