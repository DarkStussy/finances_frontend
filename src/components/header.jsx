import {Button, Container, Form, Modal, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import {getUser} from "../functions/user";
import {useEffect, useState} from "react";
import BaseNavDropdown from "./nav_dropdown";
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getAllCurrencies, setBaseCurrency} from "../functions/currency";
import {useNavigate} from "react-router-dom";
import Select from "react-select";
import {sendAPIRequest} from "../functions/requests";


const Header = (props) => {
    const [user, setUser] = useState({username: ""});
    const [currencies, setCurrencies] = useState({choice: null, list: []});
    const [portfolios, setPortfolios] = useState({choice: null, list: []});
    const [showUserInfoDropdown, setShowUserInfoDropdown] = useState(false);
    const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
    const [showFiatDropdown, setShowFiatDropdown] = useState(false);
    useEffect(() => {
        if (!props.accessToken)
            return;
        const getUsername = async () => {
            const user = await getUser(props.accessToken);
            setUser({username: user['username']});
        };

        getUsername().catch(console.error);
    }, [props.accessToken]);
    const navigate = useNavigate();
    const logout = () => {
        props.setAccessToken(null);
        setUser({username: ""});
        setShowUserInfoDropdown(false);
        navigate('/');
    };

    const getUserInfo = () => {
        if (user.username) {
            return (
                <BaseNavDropdown title={<FontAwesomeIcon icon={faEllipsisVertical}/>}
                                 drop="start" show={showUserInfoDropdown}
                                 setShow={(v) => setShowUserInfoDropdown(v)}>
                    <NavDropdown.Header>Username: {user.username}</NavDropdown.Header>
                    <LinkContainer to="/changePassword">
                        <NavDropdown.Item>Change password</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </BaseNavDropdown>
            );
        } else {
            return (
                <LinkContainer to={"/login"}>
                    <Nav.Link>Sign in</Nav.Link>
                </LinkContainer>
            )
        }
    };

    const loadCurrencies = async () => {
        const currencies = await getAllCurrencies(props.accessToken, "default");
        setCurrencies(prevState => ({choice: prevState.choice, list: currencies}));
        setShowBaseCurrencyModal(true);
    };

    const getFiatDropdown = () => {
        if (!props.accessToken)
            return <></>
        return (
            <BaseNavDropdown id="fiat" title="Fiat" drop="down-centered" show={showFiatDropdown}
                             setShow={(v) => setShowFiatDropdown(v)}>
                <NavDropdown.Header>Base currency: {props.baseCurrency.currencyCode}</NavDropdown.Header>
                <LinkContainer to="/transactions">
                    <NavDropdown.Item>Transactions</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/assets">
                    <NavDropdown.Item>Assets</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/fiatStats">
                    <NavDropdown.Item>Stats</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/categories">
                    <NavDropdown.Item>Categories</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item onClick={loadCurrencies}>Change base currency</NavDropdown.Item>
            </BaseNavDropdown>
        );
    };

    const loadPortfolios = async () => {
        const portfolios = await sendAPIRequest(props.accessToken, "/cryptoportfolio/all", "GET");
        setPortfolios(prevState => ({choice: prevState.choice, list: portfolios}));
        setShowBasePortfolioModal(true);
    };
    const getCryptoDropdown = () => {
        if (!props.accessToken)
            return <></>
        return (
            <BaseNavDropdown id="crypto" title="Crypto" drop="down-centered" show={showCryptoDropdown}
                             setShow={(v) => setShowCryptoDropdown(v)}>
                <LinkContainer to="/crypto">
                    <NavDropdown.Item>Crypto</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item onClick={loadPortfolios}>Change base portfolio</NavDropdown.Item>
            </BaseNavDropdown>
        );
    }

    const [showBaseCurrencyModal, setShowBaseCurrencyModal] = useState(false);
    const handleCloseBaseCurrencyModal = () => {
        setShowBaseCurrencyModal(false);
        props.setBaseCurrencyState({currencyCode: props.baseCurrency.currencyCode, new: {}});
    };

    const currenciesOptions = currencies.list.map((currency) => {
        const currencyCode = currency["code"];
        return {label: `${currency["name"]} | ${currencyCode}`, value: currency};
    });

    const onCurrencySelectChange = (option) => {
        setCurrencies(prevState => ({choice: option.value, list: prevState.list}));
    };
    const submitBaseCurrency = (e) => {
        e.preventDefault();

        const fetchBaseCurrency = async () => {
            const response = await setBaseCurrency(props.accessToken, currencies.choice["id"]);
            if (response.detail === "OK") {
                setShowBaseCurrencyModal(false);
                props.setBaseCurrencyState({currencyCode: currencies.choice["code"]});
                setCurrencies(prevState => ({choice: null, list: prevState.list}));
            }
        }
        fetchBaseCurrency().catch(console.error);
    };
    const [showBasePortfolioModal, setShowBasePortfolioModal] = useState(false);
    const handleClosePortfolioModal = () => setShowBasePortfolioModal(false);

    const portfoliosOptions = portfolios.list.map((portfolio) => {
        return {label: portfolio["title"], value: portfolio};
    });

    const onPortfolioSelectChange = (option) => {
        setPortfolios(prevState => ({choice: option.value, list: prevState.list}));
    };

    const onSubmitBasePortfolio = e => {
        e.preventDefault();
        const fetchBasePortfolio = async () => {
            const route = `/cryptoportfolio/baseCryptoportfolio/${portfolios.choice["id"]}`;
            const response = await sendAPIRequest(props.accessToken, route, "PUT");
            if (response.detail === "OK") {
                setShowBasePortfolioModal(false);
                setPortfolios(prevState => ({choice: null, list: prevState.list}));
            }
        };
        fetchBasePortfolio().catch(console.error);
    }

    return (
        <>
            <header>
                <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
                    <Container>
                        <LinkContainer to="/">
                            <Navbar.Brand>CashFlowMate</Navbar.Brand>
                        </LinkContainer>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                {getFiatDropdown()}
                                {getCryptoDropdown()}
                            </Nav>
                            <Nav>
                                {getUserInfo()}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
            <Modal show={showBaseCurrencyModal} onHide={handleCloseBaseCurrencyModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Change base currency</Modal.Title>
                </Modal.Header>
                <Form onSubmit={submitBaseCurrency}>
                    <Modal.Body>
                        <Select onChange={onCurrencySelectChange} className="my-select-container"
                                classNamePrefix="my-select" options={currenciesOptions}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button disabled={currencies.choice === null} type="submit"
                                className="bg-gradient"
                                variant="primary">
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal show={showBasePortfolioModal} onHide={handleClosePortfolioModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Change base portfolio</Modal.Title>
                </Modal.Header>
                <Form onSubmit={onSubmitBasePortfolio}>
                    <Modal.Body>
                        <Select className="my-select-container" classNamePrefix="my-select"
                                onChange={onPortfolioSelectChange}
                                options={portfoliosOptions}
                        />
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
        </>
    );
};

export default Header;