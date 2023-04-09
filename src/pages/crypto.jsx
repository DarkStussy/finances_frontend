import Error from "../components/error";
import CryptoComponent from "../components/crypto";


const Crypto = (props) => {
    if (!props.accessToken)
        return <Error text="Not authorizated"/>
    return <CryptoComponent accessToken={props.accessToken}/>
}

export default Crypto;