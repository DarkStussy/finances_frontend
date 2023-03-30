import {apiUrl} from "../App";


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