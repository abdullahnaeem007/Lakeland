import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import LogIn from "./components/LogIn";
import Navbar from "./components/Navbar";
import SignUp from "./components/SignUp";
import { Fragment } from "react";

function App() {
  return (
    <div class='w-full min-h-[100vh]'>

      <BrowserRouter>

        <Fragment>

          <Routes>

            <Route path="/login" exact Component={LogIn}/>
            <Route path="/signup" exact Component={SignUp}/>
            <Route path="/dashboard" exact Component={Dashboard}/>
            <Route path="/" exact Component={LandingPage}/>

          </Routes>

        </Fragment>

      </BrowserRouter>

    </div>
  );
}

export default App;
