import {Container} from "react-bootstrap";
import TransactionForm from "./forms/transaction_form";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getAssets} from "../functions/asset";
import {getInputChangeFunc, getSelectChangeFunc} from "../functions/input_change";
import {
    getAllTransactionCategories,
    getCategoriesOptions,
    getOnCreateCategoryOption
} from "../functions/transaction_category";
import BaseAlert from "./alert";
import {addTransaction, getAssetOptions, typesOptions} from "../functions/transaction";
import {getISODatetime} from "../functions/periods";
import InfinitySpinContainer from "./infinity_spin";

const AddTransactionComponent = (props) => {
    let asset = null;
    if (props.asset) {
        asset = {label: props.asset.title, value: props.asset, type: "asset"};
    }
    const [isLoading, setIsLoading] = useState(true);
    const [requestData, setRequestData] = useState({assets: [], categories: []});
    const [input, setInput] = useState({
        asset: asset, transactionType: null, category: null,
        transactionAmount: "", transactionCreated: getISODatetime(new Date())
    });
    const [showAlert, setShowAlert] = useState(
        {msg: "", show: false});
    useEffect(() => {
        if (!isLoading) return;
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

    const onCreateOption = getOnCreateCategoryOption(props.accessToken, input.transactionType, setShowAlert,
        setInput);

    const navigate = useNavigate();
    const onClickBack = e => {
        e.preventDefault();
        navigate('/transactions');
    };
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
                "created": input.transactionCreated
            }
        );
        addTransaction(props.accessToken, body).then(data => {
            if (data.detail) {
                const detail = data.detail;
                if (typeof detail === "string") {
                    setShowAlert({msg: detail, show: true});
                } else {
                    setShowAlert({msg: "Enter valid amount sum", show: true})
                }
            } else {
                if (asset)
                    navigate('/asset', {state: {assetID: asset.value.id}})
                else
                    navigate('/transactions')
            }
        });
    };

    return (
        <Container className="p-4 text-center">
            <BaseAlert type="danger" alert_text={showAlert.msg} show={showAlert.show} setShow={setShow}/>
            <h2 className="p-2">Add transaction</h2>
            {(isLoading) ? (
                <InfinitySpinContainer marginTop="8rem"/>
            ) : (
                <TransactionForm
                    type="Add"
                    onSubmit={onSubmit} onChangeSelect={onChangeSelect}
                    onCreateOption={onCreateOption}
                    onInputChange={onInputChange}
                    onClickBack={onClickBack}
                    asset={input.asset}
                    transactionType={input.transactionType}
                    category={input.category}
                    transactionAmount={input.transactionAmount}
                    assetsOptions={assetsOptions}
                    typesOptions={typesOptions}
                    categoriesOptions={categoriesOptions}
                    transactionCreated={input.transactionCreated}
                    disabledSubmit={!(input.asset && input.transactionType && input.category && input.transactionAmount && input.transactionCreated)}
                />
            )}

        </Container>
    );
}

export default AddTransactionComponent;