import {Button, ButtonGroup, Container, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {getTotalsByAsset, getTransactionsByAssetDaily} from "../functions/transaction";
import {getAssetByID} from "../functions/asset";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";

const AssetComponent = (props) => {
    let [assetTransactions, setAssetTransactions] = useState(
        {totals: {total_income: 0, total_expense: 0}, data: [], asset: {amount: 0}});
    let [date, setDate] = useState(new Date());
    useEffect(() => {
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        const getAndSetAssetTransactionsData = async () => {
            const transactions = await getTransactionsByAssetDaily(props.accessToken, props.assetID,
                startDate, endDate);
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
                        console.log(result.reason);
                }));

        }
        fetchData().catch(console.error);
    }, [date, props.assetID, props.accessToken]);

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
            return <tr key={transactionID}>
                <td>{transaction["category"]["title"]}</td>
                <td></td>
                <td></td>
                <td style={{color: amountColor}}>{transaction["amount"]} {currencyCode}</td>
            </tr>
        });
        return (
            <Table responsive key={data["created"]}
                   className="text-center mt-4 mb-4" hover variant="dark">
                <thead>
                <tr>
                    <th className="h6 fw-bold">{new Date(data["created"]).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short'
                    })}</th>
                    <th></th>
                    <th style={{color: "var(--amount-positive)"}}>{data["total_income"]} {currencyCode}</th>
                    <th style={{color: "var(--amount-negative)"}}>{data["total_expense"]} {currencyCode}</th>
                </tr>
                </thead>
                <tbody>
                {transactionRows}
                </tbody>
            </Table>
        );
    });

    const backOrForwardOneDay = (type) => {
        let newDate;
        if (type === "back")
            newDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        else
            newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        setDate(new Date(newDate));
    }

    const navigate = useNavigate();
    return (
        <Container>
            <div className="d-flex align-items-center justify-content-center">
                <h2 className="p-4 text-center">{assetTransactions.asset.title}</h2>
                <FontAwesomeIcon
                    style={{cursor: "pointer"}}
                    className="mb-2"
                    onClick={() => navigate('/changeAsset', {state: {assetID: assetTransactions.asset.id}})}
                    icon={faPenToSquare}
                    size="lg"
                />
            </div>

            <Container className="mt-3 d-flex justify-content-between">
                <ButtonGroup>
                    <Button onClick={() => backOrForwardOneDay("back")} className="bg-gradient"
                            variant="outline-secondary">&lt;</Button>
                    <Button className="bg-gradient text-white"
                            variant="outline-secondary">{date.toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                    })}</Button>
                    <Button onClick={() => backOrForwardOneDay("next")} className="bg-gradient"
                            variant="outline-secondary">&gt;</Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button variant="outline-secondary text-white">Add transaction</Button>
                </ButtonGroup>
            </Container>
            <Table responsive
                   className="text-center mt-4 mb-4" variant="dark">
                <thead>
                <tr>
                    <th>Income</th>
                    <th>Expense</th>
                    <th>Total</th>
                    <th>Balance</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td style={{color: "var(--amount-positive)"}}>{assetTransactions.totals.total_income}</td>
                    <td style={{color: "var(--amount-negative)"}}>{assetTransactions.totals.total_expense}</td>
                    <td>{assetTransactions.totals.total_income - assetTransactions.totals.total_expense}</td>
                    <td style={{color: "lightgrey"}}>{assetTransactions.asset.amount}</td>
                </tr>
                </tbody>
            </Table>
            {assetTransactionsRows}
        </Container>
    );
};

export default AssetComponent;