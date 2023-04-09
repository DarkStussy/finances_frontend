import TransactionsComponent from "../components/transactions";
import SignIn from "./sign_in";


const Transactions = (props) => {
    if (!props.accessToken)
        return <SignIn setAccessToken={props.setAccessToken}/>
    return <TransactionsComponent accessToken={props.accessToken} baseCurrency={props.baseCurrency}/>
}

export default Transactions;