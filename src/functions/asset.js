import {apiUrl} from "../App";


export const getAssets = async (accessToken) => {
    const headers = new Headers({
        accept: "application/json",
        Authorization: accessToken
    });
    const requestParams = {
        method: "GET",
        headers: headers
    }
    const response = await fetch(apiUrl + "/asset/all", requestParams);
    return await response.json();
}

export const getAssetByID = async (accessToken, assetID) => {
    const headers = new Headers({
        accept: "application/json",
        Authorization: accessToken
    });
    const requestParams = {
        method: "GET",
        headers: headers
    }
    const response = await fetch(apiUrl + `/asset/${assetID}`, requestParams);
    return await response.json();
};

export const getTotalAssets = async (accessToken) => {
    const headers = new Headers({
        accept: "application/json",
        Authorization: accessToken
    });
    const requestParams = {
        method: "GET",
        headers: headers
    }
    const response = await fetch(apiUrl + "/asset/totalPrices", requestParams);
    return await response.json();
};


export const addAsset = async (accessToken, body) => {
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
    const response = await fetch(apiUrl + "/asset/add", requestParams);
    return await response.json();
};


export const changeAsset = async (accessToken, body) => {
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
    const response = await fetch(apiUrl + "/asset/change", requestParams);
    return await response.json();
};


export const deleteAsset = async (accessToken, assetID) => {
    const headers = new Headers({
        accept: "application/json",
        Authorization: accessToken
    });
    const requestParams = {
        method: "DELETE",
        headers: headers
    }
    const response = await fetch(apiUrl + `/asset/${assetID}`, requestParams);
    return await response.json();
};