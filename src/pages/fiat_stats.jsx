import Error from "../components/error";
import FiatStatsComponent from "../components/fiat_stats";


const FiatStats = (props) => {
    if (!props.accessToken)
        return <Error text="Not authorizated"/>
    return <FiatStatsComponent accessToken={props.accessToken} baseCurrency={props.baseCurrency}/>
};

export default FiatStats;