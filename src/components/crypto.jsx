import {Badge, Button, ButtonGroup, Col, Container, Form, Modal, Row, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {sendAPIRequest, sendAPIRequestWithBody} from "../functions/requests";
import {components} from "react-select";
import CreatableSelect from "react-select/creatable";
import {getInputChangeFunc, getSelectChangeFunc} from "../functions/input_change";
import {InfinitySpin} from "react-loader-spinner";
import CryptoTransactionFormModal from "./forms/crypto_transaction_form_modal";
import {getISODatetime} from "../functions/periods";

const CryptoComponent = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [portfolioData, setPortfolioData] = useState({
        portfolio: null,
        total: 0,
        reload: false
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
        const getAndSetPortfoliosData = async () => {
            const portfolios = await sendAPIRequest(props.accessToken, "/cryptoportfolio/all", "GET");
            setPortfolios(portfolios);
            setPortfolioData(prevState => ({
                portfolio: prevState.portfolio,
                total: prevState.total,
                reload: false
            }));
        };
        getAndSetPortfoliosData().catch(console.error);
    }, [portfolioData.reload, props.accessToken]);

    useEffect(() => {
            const getAndSetPortfolioData = async () => {
                const portfolio = await sendAPIRequest(props.accessToken, "/cryptoportfolio/baseCryptoportfolio");
                if (!portfolio.detail) {
                    setPortfolioData(prevState => ({
                        portfolio: {label: portfolio["title"], value: portfolio, type: "portfolio"},
                        total: prevState.total,
                        reload: false
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
            setPortfolioData(prevState => ({
                portfolio: prevState.portfolio,
                total: prevState.total,
                reload: false
            }));
        };
        getAndSetCryptoAssets().catch(console.error);
    }, [portfolioData.portfolio, portfolioData.reload, props.accessToken]);

    useEffect(() => {
        if (assets.list.length === 0) return;
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

        fetchPrices().then(() => {
            setIsLoading(false);
            setPortfolioData(prevState => ({
                portfolio: prevState.portfolio,
                total: prevState.total,
                reload: false
            }));
        }).catch(console.error);
        const intervalId = setInterval(fetchPrices, 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, [portfolioData.reload, assets.list, props.accessToken]);
    useEffect(() => {
        if (!portfolioData.portfolio) return;
        const fetchTotalByPortfolio = async () => {
            const queryParams = new URLSearchParams({
                "portfolio_id": portfolioData.portfolio.value.id
            });
            const totalResponse = await sendAPIRequest(props.accessToken, "/cryptoportfolio/totalPrice",
                "GET", queryParams);
            setPortfolioData(prevState => ({
                portfolio: prevState.portfolio,
                total: totalResponse["total"] || 0,
                reload: prevState.reload
            }));
        };
        fetchTotalByPortfolio().catch(console.error);
        const intervalId = setInterval(fetchTotalByPortfolio, 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, [portfolioData.portfolio, props.accessToken]);


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
        setIsLoading(true);
        const body = JSON.stringify({
            "title": title
        });
        const newPortfolio = await sendAPIRequestWithBody(props.accessToken, '/cryptoportfolio/add', body);
        if (newPortfolio.detail) {
            setIsLoading(false);
            return;
        }

        setPortfolioData(prevState => ({
            portfolio: {label: newPortfolio["title"], value: newPortfolio, type: "portfolio"},
            total: prevState.total,
            reload: true
        }));
    };

    const assetsRows = assets.list.map(asset => {
        const code = asset["crypto_currency"]["code"];
        const price = assets.prices[code];
        const amount = asset["amount"]
        return (
            <tr key={code}>
                <td className="text-start m-auto"><b>{asset["crypto_currency"]["name"]}</b></td>
                <td className="text-center">
                    {amount}
                    <Badge className="ms-1 small" bg="secondary">{code}</Badge>
                </td>
                <td className="text-center">{price === undefined ? "-" : `${price} $`}</td>
                <td className="text-end">{price === undefined ? "-" : `${(amount * price).toFixed(2)} $`}</td>
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
            portfolioTitle: ""
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

        let isError = false;
        if (input.transactionAmount <= 0) {
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
        if (input.currencyPrice <= 0) {
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

        if (isError) return;

        const addTransaction = async () => {
            const body = JSON.stringify(
                {
                    "type": input.type,
                    "amount": parseFloat(input.transactionAmount),
                    "price": parseFloat(input.transactionAmount),
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
                setPortfolioData({...portfolioData, reload: true});
                setIsLoading(true);
            }
        };
        addTransaction().catch(console.error);
    }

    return (
        <Container className="crypto">
            <Row className="mt-4 text-center">
                <Col sm={4} className="mt-2">
                    <CreatableSelect className="my-select-container text-start"
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
                <Col sm={4} className="mt-3 align-content-center">
                    <h5>Balance: <span
                        style={{fontVariantNumeric: 'tabular-nums'}}>{portfolioData.total.toFixed(2)}</span> USD
                    </h5>
                </Col>
                <Col sm={4} className="mt-2">
                    <ButtonGroup className="ms-2">
                        <Button onClick={showEditPortfolioModal} className="text-white btn-sm"
                                variant="outline-secondary">Edit</Button>
                        <Button className="text-white btn-sm" variant="outline-secondary"
                                onClick={showAddTransactionModal}>Add transaction</Button>
                    </ButtonGroup>
                </Col>
            </Row>
            {(isLoading) ? (
                <Container className="mt-5 d-flex justify-content-center align-items-center">
                    <InfinitySpin color="grey"/>
                </Container>
            ) : (
                <Table responsive hover className="mt-5" variant="dark">
                    <thead>
                    <tr>
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
                <Form>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Portfolio title</Form.Label>
                            <Form.Control onChange={onInputChange} autoComplete="off"
                                          name="portfolioTitle" value={input.portfolioTitle} minLength={3}
                                          maxLength={25}/>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit"
                                className="bg-gradient"
                                variant="primary">
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default CryptoComponent;