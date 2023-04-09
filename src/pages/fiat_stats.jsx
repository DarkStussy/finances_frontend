import FiatStatsComponent from "../components/fiat_stats";
import SignIn from "./sign_in";


const FiatStats = (props) => {
    if (!props.accessToken)
        return <SignIn setAccessToken={props.setAccessToken}/>
    return <FiatStatsComponent accessToken={props.accessToken} baseCurrency={props.baseCurrency}/>
};

export default FiatStats;