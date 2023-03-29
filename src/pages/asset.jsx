import {useLocation} from "react-router-dom";
import Error from "../components/error";


const Asset = () => {
    const location = useLocation();
    if (location.state === null)
        return <Error text="Asset not found"/>

    const {assetID} = location.state;
    return <></>
}

export default Asset;