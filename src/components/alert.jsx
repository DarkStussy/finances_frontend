import {Alert} from "react-bootstrap";
import {useState} from "react";


const AlertSuccess = (props) => {
    const [show, setShow] = useState(true);
    if (show) {
        return (
            <Alert className="w-75 m-auto" variant={props.type} onClose={() => setShow(false)} dismissible>
                {props.alert_text}
            </Alert>
        );
    }
    return <></>
}

export default AlertSuccess;