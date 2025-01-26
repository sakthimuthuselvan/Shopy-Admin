import React, { Suspense, useEffect, useRef } from 'react'
import SideBar from './SideBar/SideBar'
import "./App.css"
import "./custom.scss"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import WindowWidth from './Utilities';
import NavBar2 from "./NavBar/Index";

import SingIn from './SignIn/SingIn';
import SignUp from './SignUp/SignUp';
import RouteList from "./Routes/index"
import { useSelector } from "react-redux";
import OtpCom from './OtpCom/OtpCom';
import ResetPassword from './ResetPssword/ResetPassword';
import "./sakthi.scss"

function App() {
  let size = WindowWidth()
  const globalState = useSelector((state) => state);
  const isAuth = !!localStorage.getItem("_Auth")

  return (
    <div>

      <BrowserRouter>
        {isAuth ?

          <div>
            {size === "sm" ?
              <>
                <NavBar2 />

             <div  style={{ backgroundColor: "#0306331c", paddingTop: "12vh" }}>
             <div className="container vh-100">
                  <Routes>
                    {
                      RouteList.map(({ path, component: Component }, index) => {
                        return (

                          <Route exact path={path} element={<Suspense fallback={<h1> </h1>}><Component /></Suspense>} />
                        )
                      })
                    }
                  </Routes>
                </div>
             </div>
             </>
              :
              <div className="app-container">
                <div className="sidebar">
                  {/* Sidebar Content */}
                  <SideBar />
                </div>
                <div className="main-content vh-100" style={{ backgroundColor: "#0306331c" }}>
                  <Routes>
                    {
                      RouteList.map(({ path, component: Component }, index) => {
                        return (

                          <Route exact path={path} element={<Suspense fallback={<h1> </h1>}><Component /></Suspense>} />
                        )
                      })
                    }
                  </Routes>
                </div>
              </div>}
          </div>



          // <NavBar2 />

          //    <div style={{display:size === "lg" ? "flex": ""}}>
          //   {size === "sm" || size === "md" ? <NavBar /> : <SideBar />}
          //   <div style={{ marginLeft: `${size !== "lg" ? "20px" : "20px"}`, marginRight: 20,width:'100%' }}>
          //     <Routes>
          //       {
          //         RouteList.map(({ path, component: Component }, index) => {
          //           return (

          //             <Route exact path={path} element={<Suspense fallback={<h1> </h1>}><Component /></Suspense>} />
          //           )
          //         })
          //       }
          //     </Routes>
          //   </div>
          // </div>

          :
          <Routes>
            <Route exact path="/" element={<SingIn />} />
            <Route exact path="/signUp" element={<SignUp />} />
            <Route exact path="/otp/valid" element={<OtpCom />} />
            <Route exact path="/reset/password" element={<ResetPassword />} />
          </Routes>
        }
      </BrowserRouter>




    </div>

  )
}

export default App