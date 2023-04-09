import {Button, ButtonGroup, Form, Modal} from "react-bootstrap";
import Select from "react-select";
import {errorInput} from "./sign_up_form";


const CryptoTransactionFormModal = (props) => {
    return (
        <Modal centered show={props.showModal} onHide={props.hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Add transaction</Modal.Title>
            </Modal.Header>
            <Form onSubmit={props.onSubmit}>
                <Modal.Body>
                    <ButtonGroup className="w-100">
                        <Button onClick={props.onChangeTransactionType} variant="outline-light"
                                name="buy"
                                active={props.transactionType === "buy"}>
                            Buy</Button>
                        <Button onClick={props.onChangeTransactionType} variant="outline-light"
                                name="sell"
                                active={props.transactionType === "sell"}>Sell</Button>
                    </ButtonGroup>
                    <Select className="my-select-container text-start mt-3"
                            classNamePrefix="my-select" placeholder="Cryptocurrency"
                            onChange={props.onChangeSelect}
                            value={props.cryptocurrency}
                            options={props.cryptocurrenciesOptions}
                            required/>
                    <Form.Control autoComplete="off" className="mt-3" type="number" name="currencyPrice"
                                  placeholder="Price"
                                  maxLength={17}
                                  onChange={props.onInputChange}
                                  value={props.currencyPrice}
                                  required/>
                    {errorInput(props.error.price)}
                    <Form.Control autoComplete="off" className="mt-3" type="number" name="transactionAmount"
                                  placeholder="Amount"
                                  maxLength={17}
                                  onChange={props.onInputChange}
                                  value={props.transactionAmount}
                                  required/>
                    {errorInput(props.error.amount)}
                    <Form.Control className="mt-3" type="datetime-local" name="transactionCreated"
                                  placeholder="Date"
                                  onChange={props.onInputChange}
                                  value={props.transactionCreated}
                                  required/>
                </Modal.Body>
                <Modal.Footer>
                    <small className="text-center align-content-center m-auto text-danger">
                        {props.error.add}
                    </small>
                    <Button type="submit"
                            className="bg-gradient"
                            variant="primary">
                        Save
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default CryptoTransactionFormModal;