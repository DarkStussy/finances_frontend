import {getISODate} from "./periods";
import {apiUrl} from "../App";

export const getTotalCategoriesByPeriod = async (accessToken, startDate, endDate, transactionType) => {
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
        "endDate": getISODate(endDate),
        "type": transactionType
    });
    const response = await fetch(apiUrl + "/transaction/totalCategoriesByPeriod?" + queryParams,
        requestParams);
    return await response.json();
};