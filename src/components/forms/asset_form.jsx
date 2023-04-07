import {Button, ButtonGroup, Form} from "react-bootstrap";
import Select from "react-select";

const AssetForm = ({type, onSubmit, onInputChange, onCurrencySelectChange, currenciesOptions, ...props}) => {
    return (
        <Form onSubmit={onSubmit} className="p-5 m-auto form">
            <Form.Group className="mb-3">
                <Form.Control onChange={onInputChange}
                              type="text" name="assetTitle"
                              placeholder="Title"
                              value={props.assetTitle}
                              minLength={3} maxLength={50} required/>
                <Form.Text className="text-white">
                    From 3 to 100 characters
                </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
                <Select onChange={onCurrencySelectChange} className="my-select-container text-start"
                        classNamePrefix="my-select" placeholder="Currency"
                        value={props.currencyOption}
                        options={currenciesOptions} required/>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Control onChange={onInputChange}
                              type="text" name="assetAmount" placeholder="Amount"
                              value={props.assetAmount}
                              maxLength={17}
                              required/>
            </Form.Group>
            <ButtonGroup className="w-100 mb-2">
                <Button onClick={props.onClickBack} className="bg-gradient" variant="primary" type="button">
                    Back
                </Button>
                <Button className="bg-gradient" variant="primary" type="submit">
                    {type}
                </Button>
            </ButtonGroup>
            {props.deleteButton}
        </Form>
    );
}

export default AssetForm;