export const validateAddTransactionInput = (transactionAmount, currencyPrice, setError) => {
    let isError = false;
    if (transactionAmount <= 0) {
        setError(prevState => ({
            add: prevState.add,
            price: prevState.price,
            amount: "Amount must be greater than 0"
        }));
        isError = true;
    } else {
        setError(prevState => ({
            add: prevState.add,
            price: prevState.price,
            amount: ""
        }));
    }
    if (currencyPrice <= 0) {
        setError(prevState => ({
            add: prevState.add,
            amount: prevState.amount,
            price: "Price must be greater than 0"
        }));
        isError = true;
    } else {
        setError(prevState => ({
            add: prevState.add,
            amount: prevState.amount,
            price: ""
        }));
    }
    return isError;
}