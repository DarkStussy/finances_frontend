import AssetsComponent from "../components/assets";
import Error from "../components/error";


const Assets = (props) => {
    if (props.accessToken)
        return <AssetsComponent accessToken={props.accessToken} baseCurrency={props.baseCurrency}
                                setBaseCurrencyState={props.setBaseCurrencyState}/>
    else
        return <Error text="Not authorizated"/>
}


export default Assets;