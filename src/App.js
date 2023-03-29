import Header from "./components/header";

import "./App.css";
import Footer from "./components/footer";
import {Route, Routes} from "react-router-dom";
import Main from "./pages/main";
import SignIn from "./pages/sign_in";
import SignUp from "./pages/sign_up";
import {useAccessToken} from "./functions/user";
import ChangePassword from "./pages/change_password";
import Asset from "./pages/asset";
import Assets from "./pages/assets";
import {useEffect, useState} from "react";
import {getBaseCurrency} from "./functions/currency";


export const apiUrl = process.env.REACT_APP_API_URL;

const App = () => {
    const {accessToken, setAccessToken} = useAccessToken();
    let [baseCurrency, setBaseCurrencyState] = useState({
        currentCode: "USD",
        new: {}
    });
    useEffect(() => {
        if(accessToken) {
            const getAndSetBaseCurrency = async () => {
                const baseCurrency = await getBaseCurrency(accessToken);
                if (!baseCurrency.detail)
                    setBaseCurrencyState(prevState => ({
                        new: prevState.new,
                        currentCode: baseCurrency["code"]
                    }));
            }
            getAndSetBaseCurrency().catch(console.error);
        }
    }, [accessToken]);

    return (
        <div className="App">
            <Header accessToken={accessToken} setAccessToken={setAccessToken} baseCurrency={baseCurrency}
                    setBaseCurrencyState={setBaseCurrencyState}/>
            <main className="min-vh-100">
                <Routes>
                    <Route path={'/'} element={<Main/>}/>
                    <Route path={'/login'} element={<SignIn setAccessToken={setAccessToken}/>}/>
                    <Route path={'/signup'} element={<SignUp/>}/>
                    <Route path={'/changePassword'} element={<ChangePassword accessToken={accessToken}/>}/>
                    <Route path={'/assets'} element={<Assets accessToken={accessToken} baseCurrency={baseCurrency}
                                                             setBaseCurrencyState={setBaseCurrencyState}/>}/>
                    <Route path={'/asset'} element={<Asset/>}/>
                </Routes>
            </main>
            <Footer/>
        </div>
    );
}

export default App;
