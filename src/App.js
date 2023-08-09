import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Authentication/Login/Login";
import UserRegistration from "./Authentication/UserRegistration/UserRegistration";
import DevotesRegistration from "./Authentication/DevotesRegistration/DevotesRegistration";
import Menubar from "./Components/Menubar/Menubar";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Menubar />}>
            <Route index element={<Login />} />
            <Route path="userRegistration" element={<UserRegistration />} />
            <Route
              path="devotesRegistration"
              element={<DevotesRegistration />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
