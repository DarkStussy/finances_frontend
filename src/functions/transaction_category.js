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
};

export const changeTransactionCategory = async (accessToken, categoryID, title) => {
    const headers = new Headers({
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": accessToken
    });
    const requestParams = {
        method: 'PUT',
        body: JSON.stringify({title: title, id: categoryID}),
        headers: headers
    };
    const response = await fetch(apiUrl + "/transaction/category/change", requestParams);
    return await response.json();
};

export const deleteTransactionCategory = async (accessToken, categoryID) => {
    const headers = new Headers({
        "accept": "application/json",
        "Authorization": accessToken
    });
    const requestParams = {
        method: 'DELETE',
        headers: headers
    };
    const response = await fetch(apiUrl + `/transaction/category/${categoryID}`, requestParams);
    return await response.json();
};

export const getCategoriesOptions = (categories) => {
    return categories.map((category) => {
        return {label: category["title"], value: category, type: "category"};
    });
};

export const getOnCreateCategoryOption = (accessToken, transactionType, setShowAlert, setCategory) => {
    return (title) => {
        if ((title.length >= 3 && title.length <= 50) && transactionType !== null) {
            addTransactionCategory(accessToken, title, transactionType.value).then(data => {
                if (!data.detail)
                    setCategory(prevState => ({
                        ...prevState, category: {
                            label: data.title,
                            value: data, type: "category"
                        }
                    }));
                else
                    setShowAlert({msg: "An error has occurred. Try again.", show: true});
            });
        } else {
            setShowAlert({msg: "Category name can be from 3 to 50 characters long", show: true});
        }
    };
}