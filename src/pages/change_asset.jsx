import Error from "../components/error";
import {useLocation} from "react-router-dom";
import ChangeAssetComponent from "../components/change_asset";


const ChangeAsset = (props) => {
    const location = useLocation();
    if (location.state === null)
        return <Error text="Asset not found"/>
    if (!props.accessToken)
        return <Error text="Not authorizated"/>

    const {assetID} = location.state;
    return <ChangeAssetComponent accessToken={props.accessToken} assetID={assetID}/>
}

export default ChangeAsset;