import {Button, ButtonGroup, Container, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {getAllTransactions, getTotalByPeriod} from "../functions/transaction";
import {backOrForwardOneDay} from "../functions/periods";
import {useNavigate} from "react-router-dom";
import InfinitySpinContainer from "./infinity_spin";


const TransactionsComponent = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState({income: 0, expense: 0, list: []});
    const [date, setDate] = useState(new Date());
    useEffect(() => {
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);

        const getAndSetAllTransactionsData = async () => {
            const transactions = await getAllTransactions(props.accessToken, startDate, endDate);
            setTransactions(prevState => ({
                income: prevState.income, expense: prevState.expense, list: transactions
            }));
        };
        const getAndSetTotalData = async (type) => {
            const response = await getTotalByPeriod(props.accessToken, startDate, endDate, type);
            setTransactions(prevState => ({
                ...prevState,
                [type]: response.total || 0
            }));
        };
        const fetchData = async () => {
            await Promise.allSettled(
                [getAndSetAllTransactionsData(), getAndSetTotalData('income'), getAndSetTotalData('expense')])
                .then((results) => results.forEach((result) => {
                    if (result.status === "rejected")
                        console.error(result.reason);
                }));
            setTimeout(() => setIsLoading(false), 500);
        }
        fetchData().catch(console.error);
    }, [isLoading, props.baseCurrency.currencyCode, date, props.accessToken]);

    const transactionsRows = transactions.list.map(data => {
        const transactionRows = data["transactions"].map((transaction) => {
            const transactionID = transaction["id"];
            const currencyCode = transaction["asset"]["currency"]["code"];
            const amountColor = transaction["category"]["type"] === "income" ? "var(--amount-positive)" :
                "var(--amount-negative)";
            return <tr key={transactionID} className="table-text crypto-transaction-row clickable-row"
                       onClick={() => navigate('/changeTransaction', {state: {transaction, fromAsset: false}})}>
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
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {transactionRows}
                </tbody>
            </Table>
        );
    });
    const navigate = useNavigate();
    return (
        <Container>
            <h2 className="p-4 text-center">Transactions</h2>
            <Container className="mt-3 d-flex justify-content-between">
                <ButtonGroup>
                    <Button onClick={() => {
                        backOrForwardOneDay("back", date, setDate);
                        setIsLoading(true);
                    }} className="bg-gradient fw-bold text-white"
                            variant="outline-secondary">&lt;</Button>
                    <Button className="bg-gradient text-white fw-bold btn-controls"
                            variant="outline-secondary">{date.toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                    })}</Button>
                    <Button onClick={() => {
                        backOrForwardOneDay("next", date, setDate);
                        setIsLoading(true);
                    }} className="bg-gradient fw-bold text-white"
                            variant="outline-secondary">&gt;</Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button onClick={() => {
                        navigate('/addTransaction')
                    }} variant="outline-secondary text-white fw-bold btn-controls">Add transaction</Button>
                </ButtonGroup>
            </Container>
            {(isLoading) ? (<InfinitySpinContainer marginTop="8rem"/>) : (<>
                    <Table responsive
                           className="text-center mt-4 mb-4" variant="dark">
                        <thead>
                        <tr className="table-text crypto-transaction-row">
                            <th>Income</th>
                            <th>Expense</th>
                            <th>Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="table-text crypto-transaction-row">
                            <td style={{color: "var(--amount-positive)"}}>{transactions.income.toFixed(2)} {props.baseCurrency.currencyCode}</td>
                            <td style={{color: "var(--amount-negative)"}}>{transactions.expense.toFixed(2)} {props.baseCurrency.currencyCode}</td>
                            <td>{(transactions.income - transactions.expense).toFixed(2)} {props.baseCurrency.currencyCode}</td>
                        </tr>
                        </tbody>
                    </Table>
                    {transactionsRows}
                </>
            )}
        </Container>
    );
}

export default TransactionsComponent;