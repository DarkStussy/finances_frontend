import {useEffect, useState} from "react";
import {sendAPIRequest, sendAPIRequestWithBody} from "../functions/requests";
import Error from "./error";
import {Button, Container, Stack, Table} from "react-bootstrap";
import InfinitySpinContainer from "./infinity_spin";
import {getISODatetime} from "../functions/periods";
import CryptoTransactionFormModal from "./forms/crypto_transaction_form_modal";
import {getInputChangeFunc} from "../functions/input_change";
import {validateAddTransactionInput} from "../functions/crypto_transaction";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";

const CryptoAssetComponent = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [asset, setAsset] = useState({
        data: {"crypto_currency": {}},
        price: 0,
        totalBuyAmount: 0,
        totalBuyPrice: 0
    });
    const [transactions, setTransactions] = useState([]);
    const [input, setInput] = useState({
        type: "buy",
        cryptocurrency: null,
        currencyPrice: "",
        transactionAmount: "",
        transactionCreated: "",
        transactionID: "",
        modalType: ""
    });
    const [error, setError] = useState({
        add: "",
        amount: "",
        price: ""
    });
    const [showCryptoTransactionForm, setShowCryptoTransactionForm] = useState(false);
    useEffect(() => {
        if (!isLoading) return;
        const getAndSetCryptoAsset = async () => {
            const data = await sendAPIRequest(props.accessToken, `/cryptoAsset/${props.cryptoAssetID}`);
            if (data.detail) setAsset(prevState => (
                {
                    price: prevState.price,
                    data: undefined,
                    totalBuyAmount: prevState.totalBuyAmount,
                    totalBuyPrice: prevState.totalBuyPrice
                }));
            else {
                const totalBuy = await sendAPIRequest(props.accessToken,
                    `/cryptoAsset/totalBuy?crypto_asset_id=${data.id}`);
                setAsset(prevState => ({
                    price: prevState.price,
                    data: data,
                    totalBuyAmount: totalBuy['total_amount'],
                    totalBuyPrice: totalBuy['total_price']
                }));
            }
        };
        const getAndSetCryptoTransactions = async () => {
            const queryParams = new URLSearchParams({
                "crypto_asset_id": props.cryptoAssetID
            })
            const transactions = await sendAPIRequest(props.accessToken, "/cryptoTransaction/all",
                "GET", queryParams);
            setTransactions(transactions);
        };
        const fetchData = async () => {
            await Promise.allSettled([getAndSetCryptoAsset(), getAndSetCryptoTransactions()])
                .then((results) => results.forEach((result) => {
                    if (result.status === "rejected")
                        console.error(result.reason);
                }));
            setTimeout(() => setIsLoading(false), 500);
        };
        fetchData().catch(console.error);

    }, [isLoading, props.accessToken, props.cryptoAssetID]);
    useEffect(() => {
        const cryptoCurrencyID = asset.data.crypto_currency["id"];
        if (!cryptoCurrencyID) return;
        const setCryptoCurrencyPrice = async (id) => {
            const currencyPrice = await sendAPIRequest(props.accessToken,
                `/cryptocurrency/price/${id}`);
            setAsset(prevState => ({
                data: prevState.data,
                price: currencyPrice["price"],
                totalBuyAmount: prevState.totalBuyAmount,
                totalBuyPrice: prevState.totalBuyPrice
            }));
        };
        setCryptoCurrencyPrice(cryptoCurrencyID).catch(console.error);
        const intervalId = setInterval(async () =>
            await setCryptoCurrencyPrice(cryptoCurrencyID), 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, [asset.data.crypto_currency, props.accessToken]);

    const showEditTransactionModal = (transactionID, type, amount, price, datetime) => {
        const cryptocurrency = asset.data.crypto_currency;
        setInput({
            type: type,
            cryptocurrency: {
                label: cryptocurrency.name === cryptocurrency.code ? cryptocurrency.name : `${cryptocurrency.name} ${cryptocurrency.code}`,
                value: cryptocurrency,
                type: "cryptocurrency"
            },
            currencyPrice: price,
            transactionAmount: amount,
            transactionCreated: getISODatetime(datetime),
            modalType: "Edit",
            transactionID: transactionID
        });
        setShowCryptoTransactionForm(true);
    }

    let buyPrice = 0;
    let buyCount = 0;
    const transactionsRows = transactions.map(transaction => {
        const type = transaction["type"];
        const sign = type === "buy" ? "+" : "-";
        const datetime = new Date(transaction["created"]);
        const amount = transaction["amount"];
        const price = transaction["price"];
        const color = sign === "+" ? "var(--amount-positive)" :
            "var(--amount-negative)";
        const transactionID = transaction["id"];
        const totalPrice = parseFloat((amount * price).toFixed(8));
        if (sign === '+') {
            buyPrice += totalPrice;
            buyCount++;
        }
        return (
            <tr key={transactionID} className="crypto-transaction table-text crypto-transaction-row clickable-row"
                onClick={() => showEditTransactionModal(transactionID, type, amount, price, datetime)}>
                <td className="text-start">
                    {datetime.toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',

                    })}, {`${datetime.getHours()}:${datetime.getMinutes()}`}
                </td>
                <td className="text-center">
                    {price}$
                </td>
                <td className="text-end">
                    <div className="d-flex justify-content-end">
                        {sign}{totalPrice}$
                    </div>
                    <div className="d-flex justify-content-end">
                        <small
                            style={{color: color}}>{sign}{amount} {asset.data["crypto_currency"]["code"]}</small>
                    </div>
                </td>
            </tr>
        );
    });

    const clearError = () => {
        setError({
            add: "",
            amount: "",
            price: ""
        });
    }
    const clearInput = () => {
        setInput({
            type: "buy",
            cryptocurrency: null,
            currencyPrice: "",
            transactionAmount: "",
            transactionCreated: getISODatetime(new Date()),
            modalType: "",
            transactionID: ""
        })
    };

    const hideTransactionModal = () => {
        clearInput();
        clearError();
        setShowCryptoTransactionForm(false);
    };
    const showAddTransactionModal = () => {
        const cryptocurrency = asset.data.crypto_currency;
        const cryptocurrencyName = cryptocurrency["name"];
        const cryptocurrencyCode = cryptocurrency["code"];
        setInput(prevState => ({
            type: prevState.type,
            cryptocurrency: {
                label: cryptocurrencyName === cryptocurrencyCode ? cryptocurrencyName : `${cryptocurrencyName} ${cryptocurrencyCode}`,
                value: cryptocurrency,
                type: "cryptocurrency"
            },
            currencyPrice: asset.price,
            transactionAmount: prevState.transactionAmount,
            transactionCreated: getISODatetime(new Date()),
            modalType: "Add",
            transactionID: prevState.transactionID
        }));
        setShowCryptoTransactionForm(true);
    };

    const onChangeTransactionType = e => {
        const {name} = e.target;
        setInput({...input, type: name});
    };
    const onInputChange = getInputChangeFunc(setInput);

    const onSubmitTransaction = e => {
        e.preventDefault();

        const isError = validateAddTransactionInput(input.transactionAmount, input.currencyPrice, setError);
        if (isError) return;

        const fetchTransaction = async () => {
            let body, type, method;
            if (input.modalType === "Edit") {
                type = "change";
                method = "PUT";
                body = JSON.stringify({
                    "type": input.type,
                    "amount": parseFloat(input.transactionAmount),
                    "price": parseFloat(input.currencyPrice),
                    "created": input.transactionCreated,
                    "id": input.transactionID
                });
            } else if (input.modalType === "Add") {
                type = "add";
                method = "POST";
                body = JSON.stringify(
                    {
                        "type": input.type,
                        "amount": parseFloat(input.transactionAmount),
                        "price": parseFloat(input.currencyPrice),
                        "created": input.transactionCreated,
                        "portfolio_id": asset.data["portfolio_id"],
                        "crypto_asset_id": asset.data.id
                    }
                );
            }
            const response = await sendAPIRequestWithBody(props.accessToken, `/cryptoTransaction/${type}`, body,
                method);
            if (response.detail) {
                console.error(response.detail);
                setError({...error, add: "An error occurred. Try later."});
            } else {
                hideTransactionModal();
                setIsLoading(true);
            }
        };

        fetchTransaction().catch(console.error);
    }
    const [showDeleteTransaction, setShowDeleteTransaction] = useState(false);
    const showDeleteTransactionModal = () => setShowDeleteTransaction(true);
    const hideDeleteTransactionModal = () => setShowDeleteTransaction(false);
    const onDeleteTransaction = () => {
        const deleteTransaction = async () => {
            const response = await sendAPIRequest(props.accessToken, `/cryptoTransaction/${input.transactionID}`,
                "DELETE");
            if (response.detail === "OK") {
                hideTransactionModal();
                setIsLoading(true);
            } else {
                console.error(response.detail);
                setError({...error, add: "An error occurred. Try later."});
            }
            hideDeleteTransactionModal();
        };
        deleteTransaction().catch(console.error);
    }

    const navigate = useNavigate();

    if (!asset.data) {
        return <Error text="Crypto asset not found"/>
    }

    const currentAssetPrice = asset.data["amount"] * asset.price;
    const profit = asset.price > 0 ? asset.price * asset.totalBuyAmount - asset.totalBuyPrice : 0;
    const profitRounded = Math.abs(profit).toFixed(2);
    return (
        <Container>
            <Container>
                <div className="mt-3 d-flex justify-content-start">
                    <Button onClick={() => navigate('/crypto')}
                            variant="outline-secondary" className="text-white fw-bold"
                            size="sm"><FontAwesomeIcon icon={faAngleLeft}/> <small>Back</small></Button>
                </div>
                <div className="mt-3 d-flex justify-content-start">
                    <small className="muted">{asset.data["crypto_currency"]["name"]} balance</small>
                </div>
                <div className="d-flex justify-content-start">
                    <h3>{currentAssetPrice.toFixed(2)} $</h3>
                </div>
                <Stack className="mt-1" direction="horizontal" gap={3}>
                    <div>
                        <div className="d-flex justify-content-between">
                            <small className="muted">Quantity</small>
                        </div>
                        <div className="mt-1 d-flex justify-content-between">
                            <h6 className="number-font">{asset.data["amount"]} <span
                                style={{fontSize: "95%"}}>{asset.data["crypto_currency"]["code"]}</span></h6>
                        </div>
                    </div>
                    <div className="ms-4">
                        <div className="d-flex justify-content-between">
                            <small className="muted">Total profit/loss</small>
                        </div>
                        <div className="mt-1 d-flex justify-content-between">
                            <h6 className="number-font"
                                style={{color: profit > 0 ? "var(--amount-positive)" : profitRounded === "0.00" ? "" : "var(--amount-negative)"}}>
                                {profit > 0 ? "+" : profitRounded === "0.00" ? "" : "-"}
                                {profitRounded} $
                            </h6>
                        </div>
                    </div>
                    <div className="ms-4">
                        <div className="d-flex justify-content-between">
                            <small className="muted">Average buy price</small>
                        </div>
                        <div className="mt-1 d-flex justify-content-between">
                            <h6 className="number-font">
                                {buyCount > 0 ? (buyPrice / buyCount).toFixed(2) : 0} $
                            </h6>
                        </div>
                    </div>
                </Stack>
            </Container>
            <Container className="mt-5">
                <div className="d-flex justify-content-between">
                    <h4>Transactions</h4>
                    <Button onClick={showAddTransactionModal} className="text-white fw-bold" size="sm"
                            variant="outline-secondary" active={showCryptoTransactionForm}>Add transaction</Button>
                </div>
            </Container>
            {(isLoading) ? (<InfinitySpinContainer marginTop="8rem"/>) : (
                <Table responsive hover className="mt-4" variant="dark">
                    <thead>
                    <tr className="table-text crypto-transaction-row">
                        <td className="text-start">Date</td>
                        <td className="text-center">Price</td>
                        <td className="text-end">Amount</td>
                    </tr>
                    </thead>
                    <tbody>
                    {transactionsRows}
                    </tbody>
                </Table>
            )}
            <CryptoTransactionFormModal
                type={input.modalType}
                onSubmit={onSubmitTransaction}
                showModal={showCryptoTransactionForm} hideModal={hideTransactionModal}
                transactionType={input.type}
                cryptocurrency={input.cryptocurrency}
                currencyPrice={input.currencyPrice}
                onChangeTransactionType={onChangeTransactionType}
                onInputChange={onInputChange}
                transactionAmount={input.transactionAmount}
                transactionCreated={input.transactionCreated}
                onDeleteTransaction={onDeleteTransaction}
                showDeleteTransaction={showDeleteTransaction}
                showDeleteTransactionModal={showDeleteTransactionModal}
                hideDeleteTransactionModal={hideDeleteTransactionModal}
                error={error}
            />
        </Container>
    );
};

export default CryptoAssetComponent;