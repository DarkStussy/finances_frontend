import {apiUrl} from "../App";


export const getTransactionsByAssetDaily = async (accessToken, assetID, startDate, endDate) => {
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
        "startDate": startDate.toISOString().substring(0, 10),
        "endDate": endDate.toISOString().substring(0, 10)
    });
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
        "startDate": startDate.toISOString().substring(0, 10),
        "endDate": endDate.toISOString().substring(0, 10)
    });
    const response = await fetch(apiUrl + "/transaction/totalsByAsset?" + queryParams, requestParams);
    return await response.json();
};