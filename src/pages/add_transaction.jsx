import Error from "../components/error";
import AddTransactionComponent from "../components/add_transaction";
import {useLocation} from "react-router-dom";

const AddTransaction = (props) => {
    const location = useLocation();
    if (!props.accessToken)
        return <Error text="Not authorizated"/>
    let asset = null;
    if(location.state)
        asset = location.state.asset;

    return <AddTransactionComponent accessToken={props.accessToken} asset={asset}/>
}

export default AddTransaction;