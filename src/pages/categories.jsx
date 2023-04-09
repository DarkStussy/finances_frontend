import CategoriesComponent from "../components/categories";
import SignIn from "./sign_in";


const Categories = (props) => {
    if (!props.accessToken)
        return <SignIn setAccessToken={props.setAccessToken}/>
    return <CategoriesComponent accessToken={props.accessToken}/>
}

export default Categories;