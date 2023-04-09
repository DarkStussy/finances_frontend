import {Button, Container, Modal} from "react-bootstrap";
import TransactionForm from "./forms/transaction_form";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    changeTransaction,
    deleteTransaction,
    getAssetOptions,
    typesOptions
} from "../functions/transaction";
import {getAssets} from "../functions/asset";
import {
    getAllTransactionCategories,
    getCategoriesOptions, getOnCreateCategoryOption
} from "../functions/transaction_category";
import {getInputChangeFunc, getSelectChangeFunc} from "../functions/input_change";
import BaseAlert from "./alert";
import InfinitySpinContainer from "./infinity_spin";

const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const ChangeTransactionComponent = (props) => {
    const asset = {
        label: props.transaction.asset.title, value: props.transaction.asset, type: "asset"
    };
    const transactionType = {
        label: capitalize(props.transaction.category.type),
        value: props.transaction.category.type,
        type: "transactionType"
    };
    const category = {
        label: props.transaction.category.title,
        value: props.transaction.category, type: "category"
    };
    const [requestData, setRequestData] = useState({assets: [], categories: []});
    const [input, setInput] = useState({
        asset: asset, transactionType: transactionType, category: category,
        transactionAmount: props.transaction.amount, transactionCreated: props.transaction.created
    });
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const getAndSetAssetsData = async () => {
            const assets = await getAssets(props.accessToken);
            setRequestData(prevState => ({categories: prevState.categories, assets: assets}));
            setTimeout(() => setIsLoading(false), 500);
        };
        getAndSetAssetsData().catch(console.error);
    }, [isLoading, props.accessToken]);
    useEffect(() => {
        if (input.transactionType === null) return;
        setInput(prevState => ({
            asset: prevState.asset,
            transactionType: prevState.transactionType,
            transactionAmount: prevState.transactionAmount,
            transactionCreated: prevState.transactionCreated,
            category: prevState.category
        }));
        const getAndSetTransactionCategoriesData = async () => {
            const categories = await getAllTransactionCategories(props.accessToken, input.transactionType.value);
            if (!categories.detail)
                setRequestData(prevState => ({categories: categories, assets: prevState.assets}));
        };
        getAndSetTransactionCategoriesData().catch(console.error);
    }, [input.category, props.accessToken, input.transactionType]);

    const assetsOptions = getAssetOptions(requestData.assets);
    const categoriesOptions = getCategoriesOptions(requestData.categories);

    const onChangeSelect = getSelectChangeFunc(setInput);
    const onInputChange = getInputChangeFunc(setInput);

    const [showAlert, setShowAlert] = useState(
        {msg: "", show: false});
    const onCreateOption = getOnCreateCategoryOption(props.accessToken, input.transactionType, setShowAlert,
        setInput);

    const setShow = (status) => {
        setShowAlert(prevState => ({msg: prevState.msg, show: status}));
    };
    const onSubmit = e => {
        e.preventDefault();
        const body = JSON.stringify(
            {
                "asset_id": input.asset.value.id,
                "category_id": input.category.value.id,
                "amount": parseFloat(input.transactionAmount),
                "created": input.transactionCreated,
                "id": props.transaction.id
            }
        );
        changeTransaction(props.accessToken, body).then(data => {
            if (data.detail) {
                const detail = data.detail;
                if (typeof detail === "string") {
                    setShowAlert({msg: detail, show: true});
                } else {
                    setShowAlert({msg: "Enter valid amount sum", show: true})
                }
            } else {
                if (props.fromAsset)
                    navigate('/asset', {state: {assetID: input.asset.value.id}})
                else
                    navigate('/transactions')
            }
        });
    };


    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    const handleShowDeleteModal = () => setShowDeleteModal(true);
    const navigate = useNavigate();
    const onDeleteTransaction = (e) => {
        e.preventDefault();
        setShowDeleteModal(false);
        deleteTransaction(props.accessToken, props.transaction.id).catch(console.error);
        navigate('/transactions');
    };
    const deleteButton = (
        <>
            <Button onClick={handleShowDeleteModal} className="bg-gradient w-100" variant="danger" type="button">
                Delete transaction
            </Button>
            <Modal centered show={showDeleteModal} onHide={handleCloseDeleteModal}
                   style={{background: "rgba(0, 0, 0, 0.5)"}}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete transaction?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={onDeleteTransaction}>
                        Yes, delete
                    </Button>
                    <Button variant="danger" onClick={handleCloseDeleteModal}>
                        No, back
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

    const onClickBack = () => {
        if (props.fromAsset)
            navigate('/asset', {state: {assetID: input.asset.value.id}})
        else
            navigate('/transactions');
    }
    return (
        <Container className="p-4 text-center">
            <BaseAlert type="danger" alert_text={showAlert.msg} show={showAlert.show} setShow={setShow}/>
            <h2 className="mt-2">Change transaction</h2>
            {(isLoading) ? (
                <InfinitySpinContainer marginTop="8rem"/>
            ) : (
                <TransactionForm
                    type="Change"
                    onSubmit={onSubmit}
                    onCreateOption={onCreateOption}
                    onChangeSelect={onChangeSelect}
                    onInputChange={onInputChange}
                    asset={input.asset}
                    transactionType={input.transactionType}
                    category={input.category}
                    transactionAmount={input.transactionAmount}
                    assetsOptions={assetsOptions}
                    typesOptions={typesOptions}
                    categoriesOptions={categoriesOptions}
                    transactionCreated={input.transactionCreated}
                    disabledSubmit={!(input.asset && input.transactionType && input.category && input.transactionAmount && input.transactionCreated)}
                    onClickBack={onClickBack}
                    deleteButton={deleteButton}
                />
            )}
        </Container>
    );
}

export default ChangeTransactionComponent;