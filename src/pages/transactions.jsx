import Error from "../components/error";
import TransactionsComponent from "../components/transactions";


const Transactions = (props) => {
    if (!props.accessToken)
        return <Error text="Not authorizated"/>
    return <TransactionsComponent accessToken={props.accessToken} baseCurrency={props.baseCurrency}/>
}

export default Transactions;