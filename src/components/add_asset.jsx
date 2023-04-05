import {Container} from "react-bootstrap";
import AssetForm from "./forms/asset_form";
import {useEffect, useState} from "react";
import {getAllCurrencies} from "../functions/currency";
import {getInputChangeFunc} from "../functions/input_change";
import BaseAlert from "./alert";
import {addAsset} from "../functions/asset";
import {useNavigate} from "react-router-dom";

const AddAssetComponent = (props) => {
    let [currencies, setCurrencies] = useState([]);
    let [input, setInput] = useState({currency: null, assetTitle: "", assetAmount: ""});
    let [showAlert, setShowAlert] = useState({alertType: "", msg: "", show: false});
    useEffect(() => {
        const getAndSetCurrencies = async () => {
            const currencies = await getAllCurrencies(props.accessToken, "default");
            if (!currencies.detail)
                setCurrencies(currencies);
        }
        getAndSetCurrencies().catch(console.error);
    }, [props.accessToken]);

    const currenciesOptions = currencies.map((currency) => {
        const currencyCode = currency["code"];
        return {label: `${currency["name"]} | ${currencyCode}`, value: currency};
    });

    const onCurrencySelectChange = (option) => {
        setInput(prevState => ({
            assetTitle: prevState.assetTitle,
            assetAmount: prevState.assetAmount,
            currency: option
        }));
    }

    const setShow = (status) => {
        setShowAlert(prevState => ({alertType: prevState.alertType, msg: prevState.msg, show: status}));
    }

    const onInputChange = getInputChangeFunc(setInput);

    const onSubmit = (e) => {
        e.preventDefault();
        const body = JSON.stringify(
            {
                title: input.assetTitle,
                "currency_id": input.currency.value.id,
                amount: parseFloat(input.assetAmount)
            }
        );
        addAsset(props.accessToken, body).then(data => {
            if (data.detail) {
                const detail = data.detail;
                if (typeof detail === "string") {
                    setShowAlert({alertType: "danger", msg: detail, show: true});
                } else {
                    setShowAlert({alertType: "danger", msg: "Enter valid amount sum", show: true})
                }
            } else {
                setShowAlert({alertType: "success", msg: `Asset ${data.title} successfully created`, show: true});
                setInput({currency: null, assetTitle: "", assetAmount: ""});
            }
        });
    }
    const navigate = useNavigate();
    const onClickBack = e => {
        e.preventDefault();
        navigate('/assets');
    }
    return (
        <Container className="p-5 text-center">
            <BaseAlert type={showAlert.alertType} alert_text={showAlert.msg} show={showAlert.show} setShow={setShow}/>
            <h2 className="mt-2">Add asset</h2>
            <AssetForm type="Add" onClickBack={onClickBack} onSubmit={onSubmit} onInputChange={onInputChange} onCurrencySelectChange={onCurrencySelectChange}
                       currenciesOptions={currenciesOptions}
                       currencyOption={input.currency}
                       assetTitle={input.assetTitle}
                       assetAmount={input.assetAmount}
            />
        </Container>
    );
}

export default AddAssetComponent;