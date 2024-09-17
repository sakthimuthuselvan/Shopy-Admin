import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, } from '@mui/material';
import HttpRequest from "../Utilities/ApiCall/HttpRequest";
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import "./signup.css"
import WindowWidth from "../Utilities/index"
import login from "../asset/login2.jpg"
import Loader from '../Utilities/Loader/Loader';
import MySnackbar from '../AlertShow/Alert';

function SignUp() {

    const [state, setState] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        nameErr: false,
        phoneErr: false,
        emailErr: false,
        passwordErr: false,
        errMsg: "",
        showLoader: false,
        showPassword: false,
        openSnackbar: false,
        snackType: "success",
        snackMessage: ""
    })
    const navigate = useNavigate()
    const { email, phone, password, showPassword, emailErr, passwordErr, errMsg, name, nameErr, phoneErr,showLoader,openSnackbar,snackType,snackMessage  } = state;


    const handleInputChange = (e, name, err) => {
        let value = ""
        if (name === "phone") {
            value = e.target.value.replace(/\D/g, "")
        } else {
            value = e.target.value
        }
        setState({
            ...state,
            [name]: value,
            [err]: false
        })
    }

    const submitFun = () => {
        let emailRegex = /\S+@\S+\.\S+/;
        if (!name) {
            setState({
                ...state,
                nameErr: true
            })
            document.getElementById("name").focus()
        } else if (!phone) {
            setState({
                ...state,
                phoneErr: true
            })
            document.getElementById("phone").focus()
            console.log(phone.length);
        } else if (phone.length !== 10) {
            setState({
                ...state,
                phoneErr: true,
                errMsg: "phone number should be 10 digits"
            })
        } else if (!email) {
            console.log(phone.length);
            setState({
                ...state,
                emailErr: true
            })
            document.getElementById("email").focus()
        } else if (!emailRegex.test(email)) {
            setState({
                ...state,
                emailErr: true,
                errMsg: "Please Enter correct email address"
            })

        } else if (!password) {
            setState({
                ...state,
                passwordErr: true
            })
            document.getElementById("password").focus()
        } else {
           
                createUserFun()
            
        }
    }

    const createUserFun = () => {
        setState({ ...state, showLoader: true })
        const method = "Post";
        const url = "shopy/create/user";
        const data = {
            "name": name,
            "phone": Number(phone),
            "email": email,
            "password": password,
            "user_type":"admin"
        }

        const response = HttpRequest({ method, url, data });
        response
            .then((res) => {
                console.log(res);
                setState({
                    ...state,
                    showLoader: false
                })
                navigate("/")

            }).catch((err) => {
                setState({
                    ...state,
                    showLoader: false,
                    openSnackbar: true,
                    snackType: "error",
                    snackMessage:err.message
                })
            })
    }

    const handleClickShowPassword = () => {
        setState({ ...state, showPassword: !showPassword })
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const goLogIn = () => {
        navigate("/")
    }

    const size = WindowWidth()


    return (
            <div>
                 <Loader open={showLoader}/>
                 <MySnackbar open={openSnackbar} type={snackType} variant={"filled"} message={snackMessage} duration={3000}/>

                <div className={size === "lg" ? 'overall-signin rounded' : "overall-small"}>
                    <div className={`p-0 w-100 d-flex ${size === "lg" ? "jr-card jr-card-style" : ""}`}>

                        {size === "lg" ? <div className='box-1 w-60'>
                            <img src={login} alt='login' className='w-100 h-100' />
                        </div> : null}
                        <div className={size === "lg" ? 'box-2 w-40 bg-white' : "w-100"}>
                            <div className='d-flex justify-content-center mx-3 ml-4'>
                                <div className='text-center mt-4 mx-3'>
                                    <h2>SignUp</h2>
                                    <div className='pt-4'>
                                        <TextField
                                            id='name'
                                            name='name'
                                            value={name}
                                            label="Name"
                                            variant="outlined"
                                            className='my-2 w-100'
                                            onChange={(e) => handleInputChange(e, "name", "nameErr")}
                                            error={nameErr}
                                            helperText={nameErr ? errMsg : null}
                                        />

                                        <TextField
                                            id='phone'
                                            name='phone'
                                            value={phone}
                                            label="Phone Number"
                                            variant="outlined"
                                            className='my-2 w-100'
                                            onChange={(e) => handleInputChange(e, "phone", "phoneErr")}
                                            error={phoneErr}
                                            helperText={phoneErr ? errMsg : null}
                                        />
                                        <TextField
                                            id='email'
                                            name='email'
                                            value={email}
                                            label="Email"
                                            variant="outlined"
                                            className='my-2 w-100'
                                            onChange={(e) => handleInputChange(e, "email", "emailErr")}
                                            error={emailErr}
                                            helperText={emailErr ? errMsg : null}
                                        />

                                        <FormControl
                                            id='password'
                                            className='my-2 w-100'
                                            variant="outlined"
                                            onChange={(e) => handleInputChange(e, "password", "passwordErr")}
                                            error={passwordErr}
                                            helperText={passwordErr ? errMsg : null}
                                        >
                                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-password"
                                                type={showPassword ? 'text' : 'password'}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Password"
                                            />
                                        </FormControl>
                                    </div>

                                    <div className='mt-4 py-3 mt-4'>
                                        <Button variant="contained"
                                            className='w-100 bg-primary mt-3 py-2'
                                            onClick={() => submitFun()}
                                        >Submit</Button>
                                    </div>

                                    <div className='pb-2 pt-1'>Go to <span className='text-info pointer' onClick={() => goLogIn()}>LogIn</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default SignUp