import {Container, Table} from "react-bootstrap";
import {apiUrl} from "../App";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const getAssets = async (accessToken) => {
    const headers = new Headers({
        accept: "application/json",
        Authorization: accessToken
    });
    const requestParams = {
        method: "GET",
        headers: headers
    }
    const response = await fetch(apiUrl + "/asset/all", requestParams);
    return await response.json();
}

const getTotalAssets = async (accessToken) => {
    const headers = new Headers({
        accept: "application/json",
        Authorization: accessToken
    });
    const requestParams = {
        method: "GET",
        headers: headers
    }
    const response = await fetch(apiUrl + "/asset/totalPrices", requestParams);
    return await response.json();
}

const AssetsComponent = (props) => {
    let [assets, setAssets] = useState([]);
    let [total, setTotal] = useState({amount: 0, color: "white"});
    useEffect(() => {
        const getAndSetAssetsData = async () => {
            const assets = await getAssets(props.accessToken);
            setAssets(assets);
        };
        const getAnsSetTotalAssetsData = async () => {
            const total = await getTotalAssets(props.accessToken);
            if (!total.detail) {
                const totalAmount = total["total"];
                const totalColor = totalAmount > 0 ? "var(--amount-positive)" : "var(--amount-negative)";
                setTotal({amount: totalAmount, color: totalColor});
            }
        }
        const fetchData = async () => {
            await Promise.allSettled(
                [getAndSetAssetsData(), getAnsSetTotalAssetsData()])
                .then((results) => results.forEach((result) => {
                    if (result.status === "rejected")
                        console.log(result.reason);
                }));

        }
        fetchData().catch(console.error);
    }, [props.accessToken, props.baseCurrency.currentCode]);
    const navigate = useNavigate();
    const assetsRows = assets.map((asset) => {
        const currency_code = asset["currency"] ? asset["currency"]["code"] : "USD";
        const assetID = asset["id"];
        const amount = asset["amount"];
        const amountColor = amount > 0 ? "var(--amount-positive)" : "var(--amount-negative)";
        return (
            <tr onClick={(e) => {
                e.preventDefault();
                navigate('/asset', {state: {assetID}})
            }} key={assetID}>
                <td colSpan={3}>{asset["title"]}</td>
                <td style={{color: amountColor}}>{asset["amount"]} {currency_code}</td>
            </tr>
        );
    })
    return (
        <Container>
            <Table className="text-center" hover variant="dark">
                <thead>
                <tr>
                    <th className="h4" colSpan={4}>Assets</th>
                </tr>
                </thead>
                <tbody>
                {assetsRows}
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan={3}>Total</td>
                    <td style={{color: total.color}}>{total.amount} {props.baseCurrency.currentCode}</td>
                </tr>
                </tfoot>
            </Table>
        </Container>
    );
}

export default AssetsComponent;