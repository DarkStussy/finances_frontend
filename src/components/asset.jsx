import {Button, ButtonGroup, Container, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {getTotalsByAsset, getAllTransactions} from "../functions/transaction";
import {getAssetByID} from "../functions/asset";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import {backOrForwardOneDay} from "../functions/periods";
import InfinitySpinContainer from "./infinity_spin";

const AssetComponent = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [assetTransactions, setAssetTransactions] = useState(
        {totals: {total_income: 0, total_expense: 0}, data: [], asset: {amount: 0}});
    const [date, setDate] = useState(new Date());
    useEffect(() => {
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        const getAndSetAssetTransactionsData = async () => {
            const transactions = await getAllTransactions(props.accessToken,
                startDate, endDate, props.assetID);
            setAssetTransactions(prevState => (
                {totals: prevState.totals, data: transactions, asset: prevState.asset}));
        }
        const getAndSetTotalsByAssetData = async () => {
            const totals = await getTotalsByAsset(props.accessToken, props.assetID,
                startDate, endDate);
            setAssetTransactions(prevState => (
                {totals: totals, data: prevState.data, asset: prevState.asset}));
        }
        const getAndSetAssetData = async () => {
            const asset = await getAssetByID(props.accessToken, props.assetID);
            setAssetTransactions(prevState => (
                {totals: prevState.totals, data: prevState.data, asset: asset}));
        }
        const fetchData = async () => {
            await Promise.allSettled(
                [getAndSetAssetTransactionsData(), getAndSetTotalsByAssetData(), getAndSetAssetData()])
                .then((results) => results.forEach((result) => {
                    if (result.status === "rejected")
                        console.error(result.reason);
                }));
            setTimeout(() => setIsLoading(false), 500);
        }
        fetchData().catch(console.error);
    }, [isLoading, date, props.assetID, props.accessToken]);

    const navigate = useNavigate();

    const assetTransactionsRows = assetTransactions.data.map((data) => {
        let currencyCode = null;
        const transactionRows = data["transactions"].map((transaction) => {
            if (currencyCode === null) {
                const currency = transaction["asset"]["currency"];
                if (currency === null) {
                    currencyCode = "USD";
                } else {
                    currencyCode = currency["code"];
                }
            }
            const transactionID = transaction["id"];
            const amountColor = transaction["category"]["type"] === "income" ? "var(--amount-positive)" :
                "var(--amount-negative)";
            return <tr key={transactionID} className="table-text crypto-transaction-row clickable-row"
                       onClick={() => navigate('/changeTransaction', {state: {transaction, fromAsset: true}})}>
                <td>{transaction["category"]["title"]}</td>
                <td></td>
                <td></td>
                <td style={{color: amountColor}}>{transaction["amount"].toFixed(2)} {currencyCode}</td>
            </tr>
        });
        return (
            <Table responsive key={data["created"]}
                   className="text-center mt-4 mb-4" hover variant="dark">
                <thead>
                <tr className="table-text crypto-transaction-row">
                    <th className="h6 fw-bold">{new Date(data["created"]).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short'
                    })}</th>
                    <th></th>
                    <th style={{color: "var(--amount-positive)"}}>{data["total_income"].toFixed(2)} {currencyCode}</th>
                    <th style={{color: "var(--amount-negative)"}}>{data["total_expense"].toFixed(2)} {currencyCode}</th>
                </tr>
                </thead>
                <tbody>
                {transactionRows}
                </tbody>
            </Table>
        );
    });
    return (
        <Container>
            <div className="d-flex align-items-center justify-content-center">
                <h2 className="p-4 text-center">{assetTransactions.asset.title}</h2>
                <FontAwesomeIcon
                    className="mb-2 clickable-row"
                    onClick={() => navigate('/changeAsset', {state: {assetID: assetTransactions.asset.id}})}
                    icon={faPenToSquare}
                    size="lg"
                />
            </div>

            <Container className="mt-3 d-flex justify-content-between">
                <ButtonGroup>
                    <Button onClick={() => {
                        backOrForwardOneDay("back", date, setDate);
                        setIsLoading(true);
                    }} className="bg-gradient fw-bold text-white btn-controls"
                            variant="outline-secondary">&lt;</Button>
                    <Button className="bg-gradient text-white fw-bold btn-controls"
                            variant="outline-secondary">{date.toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                    })}</Button>
                    <Button onClick={() => {
                        backOrForwardOneDay("next", date, setDate);
                        setIsLoading(true);
                    }} className="bg-gradient fw-bold text-white btn-controls"
                            variant="outline-secondary">&gt;</Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button onClick={() => navigate('/addTransaction', {state: {asset: assetTransactions.asset}})}
                            variant="outline-secondary text-white fw-bold btn-controls">Add transaction</Button>
                </ButtonGroup>
            </Container>

            {(isLoading) ? (
                <InfinitySpinContainer marginTop="8rem"/>
            ) : (
                <>
                    <Table responsive
                           className="text-center mt-4 mb-4" variant="dark">
                        <thead>
                        <tr className="table-text crypto-transaction-row">
                            <th>Income</th>
                            <th>Expense</th>
                            <th>Total</th>
                            <th>Balance</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="table-text crypto-transaction-row">
                            <td style={{color: "var(--amount-positive)"}}>{assetTransactions.totals.total_income.toFixed(2)}</td>
                            <td style={{color: "var(--amount-negative)"}}>{assetTransactions.totals.total_expense.toFixed(2)}</td>
                            <td>{(assetTransactions.totals.total_income - assetTransactions.totals.total_expense).toFixed(2)}</td>
                            <td style={{color: "lightgrey"}}>{assetTransactions.asset.amount.toFixed(2)}</td>
                        </tr>
                        </tbody>
                    </Table>
                    {assetTransactionsRows}
                </>
            )}
        </Container>
    );
};

export default AssetComponent;