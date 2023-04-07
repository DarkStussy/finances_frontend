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


const Header = (props) => {
    let [user, setUser] = useState({username: ""});
    let [currencies, setCurrencies] = useState([]);
    const [showDropdown, setShowDropdown] = useState({userInfo: false, fiat: false});
    useEffect(() => {
        if (!props.accessToken)
            return;
        const getUsername = async () => {
            const user = await getUser(props.accessToken);
            setUser({username: user['username']});
        };

        const getAndSetCurrencies = async () => {
            const currencies = await getAllCurrencies(props.accessToken, "default");
            if (!currencies.detail)
                setCurrencies(currencies);
        }
        const fetchData = async () => {
            await Promise.allSettled(
                [getUsername(), getAndSetCurrencies()])
                .then((results) => results.forEach((result) => {
                    if (result.status === "rejected")
                        console.error(result.reason);
                }));

        }
        fetchData().catch(console.error);
    }, [props.accessToken]);
    const navigate = useNavigate();
    const logout = () => {
        props.setAccessToken(null);
        setUser({username: ""});
        setShowDropdown({...showDropdown, userInfo: false});
        navigate('/');
    };

    const getUserInfo = () => {
        if (user.username) {
            return (
                <BaseNavDropdown title={<FontAwesomeIcon icon={faEllipsisVertical}/>}
                                 drop="start" show={showDropdown.userInfo}
                                 setShow={(v) => setShowDropdown({...showDropdown, userInfo: v})}>
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
    }

    const getNavlinks = () => {
        if (!props.accessToken)
            return <></>
        return <>
            <BaseNavDropdown title="Fiat" drop="down-centered" show={showDropdown.fiat}
                             setShow={(v) => setShowDropdown({
                                 ...showDropdown,
                                 fiat: v
                             })}>
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
                <NavDropdown.Item onClick={handleShow}>Change base currency</NavDropdown.Item>
            </BaseNavDropdown>
            <Nav.Link>Crypto</Nav.Link>
        </>

    }

    let [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => {
        setShowModal(false);
        props.setBaseCurrencyState({currencyCode: props.baseCurrency.currencyCode, new: {}});
    };
    const handleShow = () => setShowModal(true);

    const currenciesOptions = currencies.map((currency) => {
        const currencyCode = currency["code"];
        return {label: `${currency["name"]} | ${currencyCode}`, value: currency};
    });

    const onCurrencySelectChange = (option) => {
        props.setBaseCurrencyState({currencyCode: props.baseCurrency.currencyCode, new: option.value});
    }
    const submitBaseCurrency = (e) => {
        e.preventDefault();

        const fetchBaseCurrency = async () => {
            const response = await setBaseCurrency(props.accessToken, props.baseCurrency.new["id"]);
            if (response.detail === "OK") {
                setShowModal(false);
                props.setBaseCurrencyState({currencyCode: props.baseCurrency.new["code"], new: {}})
            }
        }
        fetchBaseCurrency().catch(console.error);

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
                                {getNavlinks()}
                            </Nav>
                            <Nav>
                                {getUserInfo()}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Change base currency</Modal.Title>
                </Modal.Header>
                <Form onSubmit={submitBaseCurrency}>
                    <Modal.Body>
                        <Select onChange={onCurrencySelectChange} className="my-select-container"
                                classNamePrefix="my-select" options={currenciesOptions}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button disabled={Object.entries(props.baseCurrency.new).length === 0} type="submit"
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