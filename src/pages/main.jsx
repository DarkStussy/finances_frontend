import {Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";


const Main = () => {
    return (
        <Container id="main" className="p-2">
            <h1 className="text-center mb-5">Welcome to CashFlowMate!</h1>
            <Row>
                <Col>
                    <p>Our application will help you easily track your finances, manage your budget, and control your
                        crypto
                        portfolios.</p>
                    <p>With our application, you can easily add your expenses and incomes, set categories, track your
                        spending
                        and earnings by days, weeks, and months.</p>
                    <p>In our application, you can also create and manage crypto portfolios, add various
                        cryptocurrencies, track
                        their changes, and receive notifications about market changes.</p>
                    <p>We have created this application with ease of use in mind, so you can easily and quickly start
                        using it
                        and managing your finances and crypto portfolios.</p>
                    <p>Join us and start controlling your expenses and incomes, as well as managing your <Link
                        to={"#crypto"}>crypto
                        portfolios</Link> today!</p>
                </Col>
            </Row>
        </Container>
    );
};

export default Main;