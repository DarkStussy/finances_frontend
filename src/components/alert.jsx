import {Alert} from "react-bootstrap";


const BaseAlert = (props) => {
    if (props.show) {
        return (
            <Alert className="w-75 m-auto" variant={props.type} onClose={() => props.setShow(false)} dismissible>
                {props.alert_text}
            </Alert>
        );
    }
    return <></>
}

export default BaseAlert;