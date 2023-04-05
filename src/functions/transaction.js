import {apiUrl} from "../App";
import {getISODate} from "./periods";


export const getAllTransactions = async (accessToken, startDate, endDate, assetID = null) => {
    const headers = new Headers({
        accept: "application/json",
        Authorization: accessToken
    });
    const requestParams = {
        method: "GET",
        headers: headers
    };

    const queryParams = new URLSearchParams({
        "startDate": getISODate(startDate),
        "endDate": getISODate(endDate)
    });

    if (assetID !== null) {
        queryParams.set("asset_id", assetID);
    }
    const response = await fetch(apiUrl + "/transaction/all?" + queryParams, requestParams);
    return await response.json();
};


export const getTotalsByAsset = async (accessToken, assetID, startDate, endDate) => {
    const headers = new Headers({
        accept: "application/json",
        Authorization: accessToken
    });
    const requestParams = {
        method: "GET",
        headers: headers
    }
    const queryParams = new URLSearchParams({
        "asset_id": assetID,
        "startDate": getISODate(startDate),
        "endDate": getISODate(endDate)
    });
    const response = await fetch(apiUrl + "/transaction/totalsByAsset?" + queryParams, requestParams);
    return await response.json();
};

export const getTotalByPeriod = async (accessToken, startDate, endDate, type, assetID = null) => {
    const headers = new Headers({
        accept: "application/json",
        Authorization: accessToken
    });
    const requestParams = {
        method: "GET",
        headers: headers
    }
    const queryParams = new URLSearchParams({
        "startDate": getISODate(startDate),
        "endDate": getISODate(endDate),
        "type": type
    });
    if (assetID !== null) {
        queryParams.set("asset_id", assetID);
    }
    const response = await fetch(apiUrl + "/transaction/totalByPeriod?" + queryParams, requestParams);
    return await response.json();
};


export const addTransaction = async (accessToken, body) => {
    const headers = new Headers({
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": accessToken
    });
    const requestParams = {
        method: 'POST',
        body: body,
        headers: headers
    };
    const response = await fetch(apiUrl + "/transaction/add", requestParams);
    return await response.json();
};

export const changeTransaction = async (accessToken, body) => {
    const headers = new Headers({
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": accessToken
    });
    const requestParams = {
        method: 'PUT',
        body: body,
        headers: headers
    };
    const response = await fetch(apiUrl + "/transaction/change", requestParams);
    return await response.json();
};


export const deleteTransaction = async (accessToken, transactionID) => {
    const headers = new Headers({
        accept: "application/json",
        Authorization: accessToken
    });
    const requestParams = {
        method: "DELETE",
        headers: headers
    }
    const response = await fetch(apiUrl + `/transaction/${transactionID}`, requestParams);
    return await response.json();
};

export const getAssetOptions = (assets) => {
    return assets.map((asset) => {
        const title = asset["title"];
        return {label: title, value: asset, type: "asset"};
    });
}

export const typesOptions = [
    {label: "Income", value: "income", type: "transactionType"},
    {label: "Expense", value: "expense", type: "transactionType"},
];