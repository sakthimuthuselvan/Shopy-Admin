import React, { useState } from 'react'
import WindowWidth from '../Utilities'
import { Button } from '@mui/material'
import "./otpstyle.css";
import login from "../asset/login2.jpg"
import { useNavigate } from 'react-router-dom';

const OtpCom = () => {
    const [state, setState] = useState({
        value: '', otp1: "", otp2: "", otp3: "", otp4: "", otp5: "", otp6: "", disable: true
    })

    const navigate = useNavigate()





    const handleChange = (value1, event) => {
        let value = event.target.value.replace(/\D/, "")
        setState((pre) => ({
            ...pre,
            [value1]: value
        }));
    }

    const handleSubmit = (event) => {

        // const data = new FormData(event.target);
        event.preventDefault();
    }

    const inputfocus = (elmnt) => {
        if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
            const next = elmnt.target.tabIndex - 2;
            if (next > -1) {

                elmnt.target.form.elements[next].focus()
            }
        }
        else if (elmnt.target.value !== "") {
            const next = elmnt.target.tabIndex;
            if (next < 6) {
                elmnt.target.form.elements[next].focus()
            }
        }
    }


    const verifyOTPFun = () => {
        navigate("/reset/password")
    }

    const size = WindowWidth()

    return (
        <div>
            <div className={size === "lg" ? 'overall-signin rounded' : "overall-small"}>
                <div className={`p-0 w-100 d-flex ${size === "lg" ? "jr-card jr-card-style" : ""}`}>

                    {size === "lg" ? <div className='box-1 w-60'>
                        <img src={login} alt='login' className='w-100' />
                    </div> : null}
                    <div className={size === "lg" ? 'box-2 w-40 bg-white' : "w-100"}>
                        <div className='d-flex justify-content-center mx-3 ml-4'>
                            <div className='text-center mt-4 mx-3'>
                                <h2 className='pt-3'>Verify OTP </h2>
                                <p className='pt-3'>An OTP has been sent to your email. Enter the OTP to reset your password.</p>


                                <div className=''>

                                    <form onSubmit={handleSubmit}>
                                        <div className="otpContainer">

                                            <input
                                                name="otp1"
                                                type="text"
                                                autoComplete="off"
                                                className="otpInput"
                                                value={state.otp1}
                                                // onKeyPress={this.keyPressed}
                                                onChange={e => handleChange("otp1", e)}
                                                tabIndex="1" maxLength="1" onKeyUp={e => inputfocus(e)}

                                            />
                                            <input
                                                name="otp2"
                                                type="text"
                                                autoComplete="off"
                                                className="otpInput"
                                                value={state.otp2}
                                                onChange={e => handleChange("otp2", e)}
                                                tabIndex="2" maxLength="1" onKeyUp={e => inputfocus(e)}

                                            />
                                            <input
                                                name="otp3"
                                                type="text"
                                                autoComplete="off"
                                                className="otpInput"
                                                value={state.otp3}
                                                onChange={e => handleChange("otp3", e)}
                                                tabIndex="3" maxLength="1" onKeyUp={e => inputfocus(e)}

                                            />
                                            <input
                                                name="otp4"
                                                type="text"
                                                autoComplete="off"
                                                className="otpInput"
                                                value={state.otp4}
                                                onChange={e => handleChange("otp4", e)}
                                                tabIndex="4" maxLength="1" onKeyUp={e => inputfocus(e)}
                                            />

                                            <input
                                                name="otp5"
                                                type="text"
                                                autoComplete="off"
                                                className="otpInput"
                                                value={state.otp5}
                                                onChange={e => handleChange("otp5", e)}
                                                tabIndex="5" maxLength="1" onKeyUp={e => inputfocus(e)}
                                            />
                                            <input
                                                name="otp6"
                                                type="text"
                                                autoComplete="off"
                                                className="otpInput"
                                                value={state.otp6}
                                                onChange={e => handleChange("otp6", e)}
                                                tabIndex="6" maxLength="1" onKeyUp={e => inputfocus(e)}
                                            />
                                        </div>
                                        <div className='submit-btn'>
                                            <Button variant="contained"
                                                className='w-100 bg-primary mt-3 py-2'
                                                onClick={() => verifyOTPFun()}
                                            >Verify OTP</Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OtpCom



