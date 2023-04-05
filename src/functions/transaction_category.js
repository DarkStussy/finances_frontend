import {apiUrl} from "../App";


export const getAllTransactionCategories = async (accessToken, transactionType = "") => {
    const headers = new Headers({
        accept: "application/json",
        Authorization: accessToken
    });
    const requestParams = {
        method: "GET",
        headers: headers
    }
    const response = await fetch(
        apiUrl + "/transaction/category/all?type=" + transactionType, requestParams);
    return await response.json();
};

export const addTransactionCategory = async (accessToken, title, type) => {
    const headers = new Headers({
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": accessToken
    });
    const requestParams = {
        method: 'POST',
        body: JSON.stringify({title: title, type: type}),
        headers: headers
    };
    const response = await fetch(apiUrl + "/transaction/category/add", requestParams);
    return await response.json();
}

export const getCategoriesOptions = (categories) => {
    return categories.map((category) => {
        return {label: category["title"], value: category, type: "category"};
    });
};

export const getOnCreateCategoryOption = (accessToken, transactionType, setShowAlert, setCategory) => {
    return (title) => {
        if (title.length >= 3 && transactionType !== null) {
            addTransactionCategory(accessToken, title, transactionType.value).then(data => {
                if (!data.detail)
                    setCategory(prevState => ({
                        ...prevState, category: {
                            label: data.title,
                            value: data, type: "category"
                        }
                    }));
            });
        } else {
            setShowAlert({msg: "The minimum title of category length is 3 characters!", show: true});
        }
    };
}