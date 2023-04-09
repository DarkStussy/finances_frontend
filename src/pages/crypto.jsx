import CryptoComponent from "../components/crypto";
import SignIn from "./sign_in";


const Crypto = (props) => {
    if (!props.accessToken)
        return <SignIn setAccessToken={props.setAccessToken}/>
    return <CryptoComponent accessToken={props.accessToken}/>
}

export default Crypto;