import Error from "../components/error";
import AddAssetComponent from "../components/add_asset";

const AddAsset = (props) => {
    if (!props.accessToken)
        return <Error text="Not authorizated"/>

    return <AddAssetComponent accessToken={props.accessToken}/>
}

export default AddAsset;