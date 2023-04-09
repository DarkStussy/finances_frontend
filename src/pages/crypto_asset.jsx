import {useLocation} from "react-router-dom";
import Error from "../components/error";
import CryptoAssetComponent from "../components/crypto_asset";
import SignIn from "./sign_in";

const CryptoAsset = (props) => {
    const location = useLocation();
    if (location.state === null)
        return <Error text="Crypto asset not found"/>
    if (!props.accessToken)
        return <SignIn setAccessToken={props.setAccessToken}/>

    const {cryptoAssetID} = location.state;
    return <CryptoAssetComponent accessToken={props.accessToken} cryptoAssetID={cryptoAssetID}/>
}

export default CryptoAsset;