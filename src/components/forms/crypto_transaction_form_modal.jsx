import {Button, ButtonGroup, Form, Modal} from "react-bootstrap";
import Select from "react-select";
import {errorInput} from "./sign_up_form";


const CryptoTransactionFormModal = (props) => {
    return (<>
            <Modal centered show={props.showModal} onHide={props.hideModal} style={{background: "rgba(0, 0, 0, 0.5)"}}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.type} transaction</Modal.Title>
                </Modal.Header>
                <Form onSubmit={props.onSubmit}>
                    <Modal.Body>
                        <ButtonGroup className="w-100">
                            <Button size="sm" onClick={props.onChangeTransactionType} variant="outline-secondary"
                                    name="buy"
                                    className="text-white"
                                    active={props.transactionType === "buy"}>
                                Buy</Button>
                            <Button size="sm" onClick={props.onChangeTransactionType} variant="outline-secondary"
                                    name="sell"
                                    className="text-white"
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
                        <small className="text-center align-content-center m-auto text-danger">
                            {props.error.add}
                        </small>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonGroup className="w-100">
                            {props.type === "Edit" ? (
                                <Button onClick={props.showDeleteTransactionModal} className="bg-gradient"
                                        variant="danger">
                                    Delete
                                </Button>
                            ) : <></>}
                            <Button type="submit"
                                    className="bg-gradient"
                                    variant="primary">
                                Save
                            </Button>
                        </ButtonGroup>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal centered show={props.showDeleteTransaction} onHide={props.hideDeleteTransactionModal}
                   style={{background: "rgba(0, 0, 0, 0.5)"}}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete crypto transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete crypto transaction?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={props.onDeleteTransaction}>
                        Yes, delete
                    </Button>
                    <Button variant="danger" onClick={props.hideDeleteTransactionModal}>
                        No, back
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CryptoTransactionFormModal;