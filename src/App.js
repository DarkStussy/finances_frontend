import Header from "./components/header";

import "./App.css";
import Footer from "./components/footer";
import {Route, Routes} from "react-router-dom";
import Main from "./pages/main";
import SignIn from "./pages/sign_in";
import SignUp from "./pages/sign_up";
import {useAccessToken} from "./functions/user";
import ChangePassword from "./pages/change_password";


export const apiUrl = process.env.REACT_APP_API_URL;

const App = () => {
    const {accessToken, setAccessToken} = useAccessToken();
    return (
        <div className="App">
            <Header accessToken={accessToken} setAccessToken={setAccessToken}/>
            <main className="min-vh-100">
                <Routes>
                    <Route path={'/'} element={<Main/>}/>
                    <Route path={'/login'} element={<SignIn setAccessToken={setAccessToken}/>}/>
                    <Route path={'/signup'} element={<SignUp/>}/>
                    <Route path={'/changePassword'} element={<ChangePassword accessToken={accessToken}/>}/>
                </Routes>
            </main>
            <Footer/>
        </div>
    );
}

export default App;
