import {useLocation} from "react-router-dom";
import Error from "../components/error";
import AssetComponent from "../components/asset";


const Asset = (props) => {
    const location = useLocation();
    if (location.state === null)
        return <Error text="Asset not found"/>
    if (!props.accessToken)
        return <Error text="Not authorizated"/>

    const {assetID} = location.state;
    return <AssetComponent accessToken={props.accessToken} assetID={assetID}/>
}

export default Asset;