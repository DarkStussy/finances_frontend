import {Button, ButtonGroup, Form} from "react-bootstrap";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

const TransactionForm = ({type, onSubmit, onInputChange, ...props}) => {
    return (
        <Form onSubmit={onSubmit} className="p-5 m-auto form">
            <Form.Group className="mb-3">
                <Form.Control onChange={onInputChange}
                              type="datetime-local" value={props.transactionCreated} name="transactionCreated"
                              placeholder="Date"
                              required/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Select className="my-select-container text-start"
                        classNamePrefix="my-select" placeholder="Asset"
                        options={props.assetsOptions}
                        value={props.asset}
                        onChange={props.onChangeSelect}
                        required/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Select className="my-select-container text-start"
                        isSearchable={false}
                        options={props.typesOptions}
                        value={props.transactionType}
                        onChange={props.onChangeSelect}
                        classNamePrefix="my-select" placeholder="Transaction type" required/>
            </Form.Group>
            <Form.Group className="mb-3">
                <CreatableSelect
                    onCreateOption={props.onCreateOption}
                    className="my-select-container text-start"
                    classNamePrefix="my-select" placeholder="Category"
                    options={props.categoriesOptions}
                    value={props.category}
                    onChange={props.onChangeSelect}
                    isDisabled={!props.transactionType}
                    required/>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Control onChange={onInputChange}
                              type="text" name="transactionAmount" placeholder="Amount"
                              value={props.transactionAmount}
                              maxLength={17}
                              required/>
            </Form.Group>
            <ButtonGroup className="w-100 mb-2">
                <Button onClick={props.onClickBack} className="bg-gradient" variant="primary" type="button">
                    Back
                </Button>
                <Button className="bg-gradient" variant="primary" type="submit" disabled={props.disabledSubmit}>
                    {type}
                </Button>
            </ButtonGroup>
            {props.deleteButton}
        </Form>
    );
};
export default TransactionForm;