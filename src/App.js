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
import AddAsset from "./pages/add_asset";
import ChangeAsset from "./pages/change_asset";
import Transactions from "./pages/transactions";
import AddTransaction from "./pages/add_transaction";
import ChangeTransaction from "./pages/change_transaction";
import Categories from "./pages/categories";
import FiatStats from "./pages/fiat_stats";
import Crypto from "./pages/crypto";
import CryptoAsset from "./pages/crypto_asset";
import PageNotFound from "./pages/404";


export const apiUrl = process.env.REACT_APP_API_URL;

const App = () => {
    const {accessToken, setAccessToken} = useAccessToken();
    const [baseCurrency, setBaseCurrencyState] = useState({
        currencyCode: "USD"
    });
    useEffect(() => {
        if (accessToken) {
            const getAndSetBaseCurrency = async () => {
                const baseCurrency = await getBaseCurrency(accessToken);
                if (!baseCurrency.detail)
                    setBaseCurrencyState({currencyCode: baseCurrency["code"]});
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

                    {/* fiat */}
                    <Route path={'/assets'} element={<Assets accessToken={accessToken} setAccessToken={setAccessToken}
                                                             baseCurrency={baseCurrency}
                                                             setBaseCurrencyState={setBaseCurrencyState}/>}/>
                    <Route path={'/asset'} element={<Asset accessToken={accessToken}/>}/>
                    <Route path={'/addAsset'} element={<AddAsset accessToken={accessToken}/>}/>
                    <Route path={'/changeAsset'} element={<ChangeAsset accessToken={accessToken}/>}/>
                    <Route path={'/transactions'}
                           element={<Transactions accessToken={accessToken} setAccessToken={setAccessToken}
                                                  baseCurrency={baseCurrency}/>}/>
                    <Route path={'/addTransaction'} element={<AddTransaction accessToken={accessToken}/>}/>
                    <Route path={'/changeTransaction'} element={<ChangeTransaction accessToken={accessToken}/>}/>
                    <Route path={'/categories'}
                           element={<Categories accessToken={accessToken} setAccessToken={setAccessToken}/>}/>
                    <Route path={'/fiatStats'}
                           element={<FiatStats accessToken={accessToken} setAccessToken={setAccessToken}
                                               baseCurrency={baseCurrency}/>}/>

                    {/* crypto */}
                    <Route path={'/crypto'}
                           element={<Crypto accessToken={accessToken} setAccessToken={setAccessToken}/>}/>
                    <Route path={'/cryptoAsset'}
                           element={<CryptoAsset accessToken={accessToken} setAccessToken={setAccessToken}/>}/>

                    {/*  not found  */}
                    <Route path="*" element={<PageNotFound/>}/>
                </Routes>
            </main>
            <Footer/>
        </div>
    );
}

export default App;
