import {Container, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {getAssets, getTotalAssets} from "../functions/asset";


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
                const totalColor = totalAmount >= 0 ? "var(--amount-positive)" : "var(--amount-negative)";
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
        const amountColor = amount >= 0 ? "var(--amount-positive)" : "var(--amount-negative)";
        return (
            <tr onClick={(e) => {
                e.preventDefault();
                navigate('/asset', {state: {assetID}});
            }} key={assetID}>
                <td colSpan={2}>{asset["title"]}</td>
                <td colSpan={2} style={{color: amountColor}}>{asset["amount"]} {currency_code}</td>
            </tr>
        );
    })
    return (
        <Container>
            <div className="d-flex align-items-center justify-content-center">
                <h2 className="p-4 text-center">Assets</h2>
                <FontAwesomeIcon
                    style={{cursor: "pointer"}}
                    className="mb-1"
                    onClick={() => navigate('/addAsset')}
                    icon={faPlus}
                    size="xl"/>
            </div>
            <Table className="text-center mt-3" hover variant="dark">
                <tbody>
                {assetsRows}
                </tbody>
                <tfoot>
                <tr id="assetsFooter">
                    <td colSpan={2} className="fw-bold">Total</td>
                    <td colSpan={2} style={{color: total.color}}>{total.amount} {props.baseCurrency.currentCode}</td>
                </tr>
                </tfoot>
            </Table>
        </Container>
    );
}

export default AssetsComponent;