import {apiUrl} from "../App";

export const sendAPIRequest = async (accessToken, route, method = "GET", queryParams = null) => {
    const headers = new Headers({
        accept: "application/json",
        Authorization: accessToken
    });
    const requestParams = {
        method: method,
        headers: headers
    }
    let url = apiUrl + route;
    if (queryParams !== null) {
        url += `?${queryParams}`;
    }

    const response = await fetch(url, requestParams);
    return await response.json();
};

export const sendAPIRequestWithBody = async (accessToken, route, body, method = "POST") => {
    const headers = new Headers({
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": accessToken
    });
    const requestParams = {
        method: method,
        body: body,
        headers: headers
    };
    const response = await fetch(apiUrl + route, requestParams);
    return await response.json();
};