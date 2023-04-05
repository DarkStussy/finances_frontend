import Error from "../components/error";
import {useLocation} from "react-router-dom";
import ChangeTransactionComponent from "../components/change_transaction";


const ChangeTransaction = (props) => {
    const location = useLocation();
    if (location.state === null)
        return <Error text="Transaction not found"/>
    if (!props.accessToken)
        return <Error text="Not authorizated"/>

    const {transaction, fromAsset} = location.state;
    return <ChangeTransactionComponent accessToken={props.accessToken} transaction={transaction}
                                       fromAsset={fromAsset}/>
}

export default ChangeTransaction;