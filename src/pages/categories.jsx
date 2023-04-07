import Error from "../components/error";
import CategoriesComponent from "../components/categories";


const Categories = (props) => {
    if (!props.accessToken)
        return <Error text="Not authorizated"/>
    return <CategoriesComponent accessToken={props.accessToken}/>
}

export default Categories;