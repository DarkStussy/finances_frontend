import {Badge, Button, ButtonGroup, Col, Container, Form, Modal, Row, Stack, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {sendAPIRequest, sendAPIRequestWithBody} from "../functions/requests";
import {components} from "react-select";
import CreatableSelect from "react-select/creatable";
import {getInputChangeFunc, getSelectChangeFunc} from "../functions/input_change";
import CryptoTransactionFormModal from "./forms/crypto_transaction_form_modal";
import {getISODatetime} from "../functions/periods";
import {useNavigate} from "react-router-dom";
import InfinitySpinContainer from "./infinity_spin";
import {validateAddTransactionInput} from "../functions/crypto_transaction";

const CryptoComponent = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [portfolioData, setPortfolioData] = useState({
        portfolio: null,
        total: 0,
        totalsBuy: []
    });
    const [portfolios, setPortfolios] = useState([]);
    const [assets, setAssets] = useState({list: [], prices: {}});
    const [cryptocurrencies, setCryptocurrencies] = useState([]);
    const [input, setInput] = useState({
        type: "buy",
        cryptocurrency: null,
        currencyPrice: "",
        transactionAmount: "",
        transactionCreated: getISODatetime(new Date()),
        portfolioTitle: ""
    });
    const [error, setError] = useState({
        add: "",
        amount: "",
        price: ""
    });
    useEffect(() => {
        if (!isLoading) return;
        const getAndSetPortfoliosData = async () => {
            const portfolios = await sendAPIRequest(props.accessToken, "/cryptoportfolio/all", "GET");
            setPortfolios(portfolios);
        };
        getAndSetPortfoliosData().catch(console.error);
    }, [isLoading, props.accessToken]);

    useEffect(() => {
            const getAndSetPortfolioData = async () => {
                const portfolio = await sendAPIRequest(props.accessToken, "/cryptoportfolio/baseCryptoportfolio");
                if (!portfolio.detail) {
                    setPortfolioData(prevState => ({
                        portfolio: {label: portfolio["title"], value: portfolio, type: "portfolio"},
                        total: prevState.total,
                        totalsBuy: prevState.totalsBuy
                    }));
                    setInput(prevState => ({
                        type: prevState.type,
                        cryptocurrency: prevState.cryptocurrency,
                        currencyPrice: prevState.currencyPrice,
                        transactionAmount: prevState.transactionAmount,
                        transactionCreated: prevState.transactionCreated,
                        portfolioTitle: portfolio.title
                    }));
                } else {
                    setIsLoading(false);
                }
            };
            getAndSetPortfolioData().catch(console.error);
        }, [props.accessToken]
    );
    useEffect(() => {
        if (!portfolioData.portfolio) return;
        if (!isLoading) return;
        const getAndSetCryptoAssets = async () => {
            const queryParams = new URLSearchParams({
                "portfolio_id": portfolioData.portfolio.value.id
            });
            const assets = await sendAPIRequest(props.accessToken, "/cryptoAsset/all", "GET",
                queryParams);
            if (!assets.detail) {
                setAssets(prevState => ({list: assets, prices: prevState.prices}));
                if (assets.length === 0) setIsLoading(false);
            }
        };
        getAndSetCryptoAssets().catch(console.error);
    }, [isLoading, portfolioData.portfolio, props.accessToken]);

    useEffect(() => {
        if (!portfolioData.portfolio) return;
        if (assets.list.length === 0) return;

        const fetchTotalByPortfolio = async () => {
            const queryParams = new URLSearchParams({
                "portfolio_id": portfolioData.portfolio.value.id
            });
            const totalResponse = await sendAPIRequest(props.accessToken, "/cryptoportfolio/totalPrice",
                "GET", queryParams);

            setPortfolioData(prevState => ({
                portfolio: prevState.portfolio,
                total: totalResponse["total"] || 0,
                totalsBuy: totalResponse["totals_buy"] || []
            }));
        };
        const fetchPrices = async () => {
            const body = JSON.stringify({
                "crypto_currencies": assets.list.map(asset => {
                    return asset["crypto_currency"]["id"];
                })
            });
            const cryptocurrencies = await sendAPIRequestWithBody(props.accessToken, '/cryptocurrency/price', body);
            if (!cryptocurrencies.detail) {
                cryptocurrencies.forEach(cryptocurrency => {
                    setAssets(prevState => (
                        {
                            list: prevState.list,
                            prices: {...prevState.prices, [cryptocurrency["code"]]: cryptocurrency["price"]}
                        }));
                });
            }
        };

        const fetchData = async () => {
            await Promise.allSettled([fetchPrices(), fetchTotalByPortfolio()]);
        };

        fetchData().then(() => {
            setIsLoading(false);
        }).catch(console.error);
        const intervalId = setInterval(fetchData, 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, [portfolioData.portfolio, assets.list, props.accessToken]);

    const portfoliosOptions = portfolios.map(portfolio => {
        return {label: portfolio["title"], value: portfolio, type: "portfolio"};
    });

    const onPortfolioSelectChange = (option) => {
        setIsLoading(true);
        setPortfolioData(prevState => ({
            ...prevState,
            [option.type]: option
        }));
        setInput(prevState => ({
            type: prevState.type,
            cryptocurrency: prevState.cryptocurrency,
            currencyPrice: prevState.currencyPrice,
            transactionAmount: prevState.transactionAmount,
            transactionCreated: prevState.transactionCreated,
            portfolioTitle: option.value.title
        }));
    };
    const onCreatePortfolio = async (title) => {
        if (title.length < 3) return alert("Portfolio title can be from 3 to 25 characters");
        const body = JSON.stringify({
            "title": title
        });
        const newPortfolio = await sendAPIRequestWithBody(props.accessToken, '/cryptoportfolio/add', body);
        if (newPortfolio.detail) return;
        setIsLoading(true);
        const portfolioTitle = newPortfolio["title"];
        setPortfolioData(prevState => ({
            portfolio: {label: portfolioTitle, value: newPortfolio, type: "portfolio"},
            total: prevState.total,
            totalsBuy: prevState.totalsBuy
        }));
        setInput(prevState => ({
            ...prevState,
            portfolioTitle: portfolioTitle
        }));
    };
    const navigate = useNavigate();
    const assetsRows = assets.list.map(asset => {
        const code = asset["crypto_currency"]["code"];
        const price = assets.prices[code];
        const amount = asset["amount"]
        return (
            <tr key={code} onClick={() => navigate('/cryptoAsset', {state: {cryptoAssetID: asset["id"]}})}
                className="table-text crypto-transaction-row clickable-row">
                <td className="text-start m-auto"><b>{asset["crypto_currency"]["name"]}</b></td>
                <td className="text-center">
                    {amount}
                    <Badge className="ms-1 small" bg="secondary">{code}</Badge>
                </td>
                <td className="text-center">{price === undefined ? "-" : `${price} $`}</td>
                <td className="text-end">{price === undefined ? "-" : `${parseFloat((amount * price).toFixed(8))} $`}</td>
            </tr>
        );
    });

    const clearInput = () => {
        setInput({
            type: "buy",
            cryptocurrency: null,
            currencyPrice: "",
            transactionAmount: "",
            transactionCreated: getISODatetime(new Date()),
            portfolioTitle: input.portfolioTitle
        })
    };
    const clearError = () => {
        setError({
            add: "",
            price: "",
            amount: ""
        })
    };

    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const hideAddTransactionModal = () => {
        clearInput();
        clearError();
        setShowAddTransaction(false);
    };
    const showAddTransactionModal = async () => {
        const cryptocurrencies = await sendAPIRequest(props.accessToken, '/cryptocurrency/all');
        setCryptocurrencies(cryptocurrencies);
        setShowAddTransaction(true)
    };

    const [showEditPortfolio, setShowEditPortfolio] = useState(false);

    const hideEditPortfolioModal = () => {
        setShowEditPortfolio(false);
    };
    const showEditPortfolioModal = () => {
        if (portfolioData.portfolio)
            setShowEditPortfolio(true);
    };

    const onChangeTransactionType = e => {
        const {name} = e.target;
        setInput({...input, type: name});
    };
    const onChangeSelect = async (option) => {
        const response = await sendAPIRequest(props.accessToken, `/cryptocurrency/price/${option.value.id}`);
        setInput({...input, currencyPrice: response["price"] || ""});
        getSelectChangeFunc(setInput)(option)
    };
    const onInputChange = getInputChangeFunc(setInput);

    const cryptocurrenciesOptions = cryptocurrencies.map(cryptocurrency => {
        const name = cryptocurrency["name"];
        const code = cryptocurrency["code"];
        return {label: name === code ? name : `${name} ${code}`, value: cryptocurrency, type: "cryptocurrency"};
    });
    const onSubmitAddTransaction = e => {
        e.preventDefault();

        const isError = validateAddTransactionInput(input.transactionAmount, input.currencyPrice, setError);
        if (isError) return;

        const addTransaction = async () => {
            const body = JSON.stringify(
                {
                    "type": input.type,
                    "amount": parseFloat(input.transactionAmount),
                    "price": parseFloat(input.currencyPrice),
                    "created": input.transactionCreated,
                    "portfolio_id": portfolioData.portfolio.value.id,
                    "crypto_currency_id": input.cryptocurrency.value.id
                }
            );
            const response = await sendAPIRequestWithBody(props.accessToken, "/cryptoTransaction/add", body);
            if (response.detail) {
                console.error(response.detail);
                setError({...error, add: "An error occurred. Try later."});
            } else {
                hideAddTransactionModal();
                clearInput();
                setIsLoading(true);
            }
        };
        addTransaction().catch(console.error);
    }

    const onSubmitEditPortfolio = (e) => {
        e.preventDefault();
        const body = JSON.stringify({
            "title": input.portfolioTitle,
            "id": portfolioData.portfolio.value.id
        });
        sendAPIRequestWithBody(props.accessToken, "/cryptoportfolio/change", body, "PUT").then(portfolio => {
            if (!portfolio.detail) {
                const portfolioTitle = portfolio["title"];
                setPortfolioData({
                    total: portfolioData.total,
                    portfolio: {label: portfolioTitle, value: portfolio, type: "portfolio"},
                    totalsBuy: portfolioData.totalsBuy
                });
                setInput({...input, portfolioTitle: portfolioTitle});
                setIsLoading(true);
            }
            hideEditPortfolioModal();
        }).catch(console.error);
    };

    const [showDeletePortfolio, setShowDeletePortfolio] = useState(false);
    const showDeletePortfolioModal = () => setShowDeletePortfolio(true);
    const hideDeletePortfolioModal = () => setShowDeletePortfolio(false);

    const onDeletePortfolio = async () => {
        const response = await sendAPIRequest(props.accessToken,
            `/cryptoportfolio/${portfolioData.portfolio.value.id}`, 'DELETE');
        if (response.detail === 'OK') {
            if (portfolios.length > 1) {
                let portfolio = portfolios[0];
                if (portfolio.id === portfolioData.portfolio.value.id)
                    portfolio = portfolios[1];

                setPortfolioData({
                    total: portfolioData.total,
                    portfolio: {label: portfolio["title"], value: portfolio, type: "portfolio"},
                    totalsBuy: portfolioData.totalsBuy
                });
                setInput({...input, portfolioTitle: portfolio["title"]});
            } else {
                setPortfolioData({
                    total: 0,
                    portfolio: null,
                    totalsBuy: []
                });
                setAssets({list: [], prices: {}});
                setInput({...input, portfolioTitle: ""});
                setTimeout(() => setIsLoading(false), 1000);
            }
            setIsLoading(true);
        }
        hideDeletePortfolioModal();
        hideEditPortfolioModal();
    };


    let totalProfit = 0;
    portfolioData.totalsBuy.forEach(totalBuy => {
        const currency_price = assets.prices[totalBuy["currency_code"]] || 0;
        totalProfit += currency_price > 0 ? currency_price * totalBuy["total_amount"] - totalBuy["total_price"] : 0;
    });
    const totalProfitRounded = Math.abs(totalProfit).toFixed(2);

    return (
        <Container className="table-response">
            <Row className="mt-4 text-center">
                <Col sm={6} className="mt-2 text-center">
                    <CreatableSelect className="my-select-container portfolio-select text-start"
                                     classNamePrefix="my-select" placeholder="Portfolio"
                                     value={portfolioData.portfolio}
                                     options={portfoliosOptions}
                                     onChange={onPortfolioSelectChange}
                                     onCreateOption={onCreatePortfolio}
                                     components={{
                                         Input: (props) => (
                                             <components.Input {...props} maxLength={25}/>
                                         ),
                                     }}
                    />
                </Col>
                <Col sm={6} className="mt-2 text-end">
                    <ButtonGroup className="buttons-portfolio mt-1">
                        <Button onClick={showEditPortfolioModal} className="text-white fw-bold" size="sm"
                                variant="outline-secondary" active={showEditPortfolio}>Edit</Button>
                        <Button className="text-white fw-bold" variant="outline-secondary" size="sm"
                                onClick={showAddTransactionModal} active={showAddTransaction}>Add transaction</Button>
                    </ButtonGroup>
                </Col>
            </Row>
            <Container>
                <div className="mt-3 d-flex justify-content-start">
                    <small className="muted">Current balance</small>
                </div>
                <div className="d-flex justify-content-start">
                    <h3 style={{fontVariantNumeric: 'tabular-nums'}}>{portfolioData.total.toFixed(2)} $</h3>
                </div>
                <Stack className="mt-1" direction="horizontal" gap={1}>
                    <div>
                        <div className="d-flex justify-content-between">
                            <small className="muted">Total profit/loss</small>
                        </div>
                        <div className="mt-1 d-flex justify-content-between">
                            <h6 className="number-font"
                                style={{color: totalProfit > 0 ? "var(--amount-positive)" : totalProfitRounded === "0.00" ? "" : "var(--amount-negative)"}}>
                                {totalProfit > 0 ? "+" : totalProfitRounded === "0.00" ? "" : "-"}
                                {totalProfitRounded} $</h6>
                        </div>
                    </div>
                </Stack>
            </Container>
            {(isLoading) ? (
                <InfinitySpinContainer marginTop="6rem"/>
            ) : (
                <Table responsive hover className="mt-4" variant="dark">
                    <thead>
                    <tr className="table-text crypto-transaction-row">
                        <td className="text-start">Asset</td>
                        <td className="text-center">Balance</td>
                        <td className="text-center">Price</td>
                        <td className="text-end">Total</td>
                    </tr>
                    </thead>
                    <tbody>
                    {assetsRows}
                    </tbody>
                </Table>
            )}
            <CryptoTransactionFormModal
                type="Add"
                onSubmit={onSubmitAddTransaction}
                showModal={showAddTransaction} hideModal={hideAddTransactionModal}
                transactionType={input.type}
                cryptocurrency={input.cryptocurrency}
                currencyPrice={input.currencyPrice}
                transactionAmount={input.transactionAmount}
                onChangeTransactionType={onChangeTransactionType}
                transactionCreated={input.transactionCreated}
                onChangeSelect={onChangeSelect}
                onInputChange={onInputChange}
                cryptocurrenciesOptions={cryptocurrenciesOptions}
                error={error}
            />
            <Modal centered show={showEditPortfolio} onHide={hideEditPortfolioModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit portfolio</Modal.Title>
                </Modal.Header>
                <Form onSubmit={onSubmitEditPortfolio}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Portfolio title</Form.Label>
                            <Form.Control onChange={onInputChange} autoComplete="off"
                                          name="portfolioTitle" value={input.portfolioTitle} minLength={3}
                                          maxLength={25}/>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onClick={showDeletePortfolioModal}
                            className="bg-gradient"
                            variant="danger">
                            Delete
                        </Button>
                        <Button type="submit"
                                className="bg-gradient"
                                variant="primary">
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal centered show={showDeletePortfolio} onHide={hideDeletePortfolioModal}
                   style={{background: "rgba(0, 0, 0, 0.5)"}}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete crypto transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete crypto transaction?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={onDeletePortfolio}>
                        Yes, delete
                    </Button>
                    <Button variant="danger" onClick={hideDeletePortfolioModal}>
                        No, back
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CryptoComponent;