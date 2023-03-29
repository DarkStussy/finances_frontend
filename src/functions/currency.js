import {apiUrl} from "../App";


export const getBaseCurrency = async (accessToken) => {
    const headers = new Headers({
        accept: "application/json",
        Authorization: accessToken
    });
    const requestParams = {
        method: "GET",
        headers: headers
    }
    const response = await fetch(apiUrl + "/currency/baseCurrency", requestParams);
    return await response.json();
};

export const setBaseCurrency = async (accessToken, currencyID) => {
    const headers = new Headers({
        accept: "application/json",
        Authorization: accessToken
    });
    const requestParams = {
        method: "PUT",
        headers: headers
    }
    const response = await fetch(apiUrl + `/currency/baseCurrency/${currencyID}`, requestParams);
    return await response.json();
};


export const getAllCurrencies = async (accessToken, currency_type = "all") => {
    const headers = new Headers({
        accept: "application/json",
        Authorization: accessToken
    });
    const requestParams = {
        method: "GET",
        headers: headers
    }
    const queryParams = new URLSearchParams({
        currency_type: currency_type
    });
    const response = await fetch(apiUrl + "/currency/all?" + queryParams, requestParams);
    return await response.json();
};