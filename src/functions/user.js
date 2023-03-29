import {apiUrl} from "../App";
import {useState} from "react";

export const getUser = async (accessToken) => {
    const headers = new Headers({
        Authorization: accessToken
    });
    const requestParams = {
        method: "GET",
        headers: headers
    }
    const response = await fetch(apiUrl + "/user/me", requestParams);
    return await response.json();
}


export const useAccessToken = () => {
    const getToken = () => {
        return localStorage.getItem('access_token');
    };
    const [token, setToken] = useState(getToken());
    const saveToken = accessToken => {
        if(!accessToken)
            localStorage.removeItem("access_token");
        else
            localStorage.setItem('access_token', accessToken);
        setToken(accessToken);
    };

    return {
        accessToken: token,
        setAccessToken: saveToken
    }
}