import BaseAlert from "./alert";
import AssetForm from "./forms/asset_form";
import {Button, Container, Modal} from "react-bootstrap";
import {useEffect, useState} from "react";
import {getAllCurrencies} from "../functions/currency";
import {changeAsset, deleteAsset, getAssetByID} from "../functions/asset";
import {getInputChangeFunc} from "../functions/input_change";
import {useNavigate} from "react-router-dom";

const ChangeAssetComponent = (props) => {
    let [changedAsset, setChangedAsset] = useState({
        id: props.assetID,
        currency: {},
        assetTitle: "",
        assetAmount: ""
    });
    let [currencies, setCurrencies] = useState([]);
    let [showAlert, setShowAlert] = useState(
        {alertType: "", msg: "", show: false});
    useEffect(() => {
        const getAndSetAssetData = async () => {
            const asset = await getAssetByID(props.accessToken, props.assetID);
            setChangedAsset(prevState => ({
                id: prevState.id,
                currency: {label: `${asset.currency["name"]} | ${asset.currency["code"]}`, value: asset.currency},
                assetTitle: asset.title,
                assetAmount: asset.amount
            }));
        }
        const getAndSetCurrencies = async () => {
            const currencies = await getAllCurrencies(props.accessToken, "default");
            if (!currencies.detail)
                setCurrencies(currencies);
        }

        const fetchData = async () => {
            await Promise.allSettled(
                [getAndSetCurrencies(), getAndSetAssetData()])
                .then((results) => results.forEach((result) => {
                    if (result.status === "rejected")
                        console.log(result.reason);
                }));

        }
        fetchData().catch(console.log);
    }, [props.assetID, props.accessToken]);

    const currenciesOptions = currencies.map((currency) => {
        const currencyCode = currency["code"];
        return {label: `${currency["name"]} | ${currencyCode}`, value: currency};
    });

    const onCurrencySelectChange = (option) => {
        setChangedAsset(prevState => ({
            id: prevState.id,
            assetTitle: prevState.assetTitle,
            assetAmount: prevState.assetAmount,
            currency: option
        }));
    }

    const setShow = (status) => {
        setShowAlert(prevState => (
            {alertType: prevState.alertType, msg: prevState.msg, show: status}));
    }

    const onInputChange = getInputChangeFunc(setChangedAsset);

    const onSubmit = (e) => {
        e.preventDefault();
        const body = JSON.stringify(
            {
                title: changedAsset.assetTitle,
                "currency_id": changedAsset.currency.value.id,
                amount: parseFloat(changedAsset.assetAmount),
                id: changedAsset.id
            }
        );
        changeAsset(props.accessToken, body).then(data => {
            if (data.detail) {
                const detail = data.detail;
                if (typeof detail === "string") {
                    setShowAlert({alertType: "danger", msg: detail, show: true});
                } else {
                    setShowAlert({alertType: "danger", msg: "Enter valid amount sum", show: true})
                }
            } else {
                setShowAlert({alertType: "success", msg: `Asset ${data.title} successfully changed`, show: true});
            }
        });
    };
    const navigate = useNavigate();
    const onClickBack = e => {
        e.preventDefault();
        navigate('/asset', {state: {assetID: changedAsset.id}});
    }

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    const handleShowDeleteModal = () => setShowDeleteModal(true);

    const onDeleteAsset = (e) => {
        e.preventDefault();
        setShowDeleteModal(false);
        deleteAsset(props.accessToken, props.assetID).catch(console.error);
        navigate('/assets');
    };

    const deleteButton = (
        <>
            <Button onClick={handleShowDeleteModal} className="bg-gradient w-100" variant="danger" type="button">
                Delete asset
            </Button>
            <Modal centered show={showDeleteModal} onHide={handleCloseDeleteModal}
                   style={{background: "rgba(0, 0, 0, 0.5)"}}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete asset</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete asset <b className="fs-5">{changedAsset.assetTitle}</b>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={onDeleteAsset}>
                        Yes, delete
                    </Button>
                    <Button variant="danger" onClick={handleCloseDeleteModal}>
                        No, back
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

    return (
        <Container className="p-5 text-center">
            <BaseAlert type={showAlert.alertType} alert_text={showAlert.msg} show={showAlert.show} setShow={setShow}/>
            <h2 className="mt-2">Change asset</h2>
            <AssetForm type="Change" onClickBack={onClickBack} onSubmit={onSubmit} onInputChange={onInputChange}
                       onCurrencySelectChange={onCurrencySelectChange}
                       currenciesOptions={currenciesOptions}
                       currencyOption={changedAsset.currency}
                       assetTitle={changedAsset.assetTitle}
                       assetAmount={changedAsset.assetAmount}
                       deleteButton={deleteButton}
            />

        </Container>
    );
}

export default ChangeAssetComponent;