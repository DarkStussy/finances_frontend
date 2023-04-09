import {InfinitySpin} from "react-loader-spinner";
import {Container} from "react-bootstrap";


const InfinitySpinContainer = (props) => {
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{marginTop: props.marginTop}}>
             <InfinitySpin color="grey"/>
        </Container>
    );
};

export default InfinitySpinContainer;