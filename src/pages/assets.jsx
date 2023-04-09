import AssetsComponent from "../components/assets";
import SignIn from "./sign_in";


const Assets = (props) => {
    if (!props.accessToken)
        return <SignIn setAccessToken={props.setAccessToken}/>

    return <AssetsComponent accessToken={props.accessToken} baseCurrency={props.baseCurrency}
                            setBaseCurrencyState={props.setBaseCurrencyState}/>

}


export default Assets;