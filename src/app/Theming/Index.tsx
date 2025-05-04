import { Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import MySnackbar from '../../AlertShow/Alert';
import HttpRequest from '../../Utilities/ApiCall/HttpRequest';

interface formVal {
  submitDisable: boolean;
  companyName: string;
  favIcon: any;
  favIconUrl: string;
  fontVal: string;
  primaryVal: string;
  secondaryVal: string;
  successVal: string;
  openSnakbar: boolean;
  openSnakbarType: string;
  openSnakbarMsg: string;
}
const Index: React.FC = () => {
  const [formVal, setFormVal] = useState<formVal>({
    submitDisable: true,
    favIconUrl: "",
    companyName: "",
    favIcon: null,
    fontVal: "",
    primaryVal: "",
    secondaryVal: "",
    successVal: "",
    openSnakbar: false,
    openSnakbarType: "",
    openSnakbarMsg: ""
  })

  const { fontVal, primaryVal, secondaryVal, successVal, openSnakbarMsg, openSnakbar, openSnakbarType, companyName, favIcon, favIconUrl, submitDisable } = formVal;


  useEffect(() => {
    getThemeApiCallFun()
  }, [])

  const getThemeApiCallFun = () => {
    const method: string = "GET";
    const url: string = "site-setting-api/get";
    const data: any = {}
    axiosApiCallFun(method, url, data, "getThemeReq")
  }


  const getThemeResFun = (response) => {
    const data = response && response.response_data ? response.response_data : {};
    if (Object.keys(data).length > 0) {
      //   {
      //     "_id": "6730ecf141f54f16acf59fcd",
      //     "company_name": "Shopy",
      //     "fav_icon": "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      //     "font_family": "Poppins",
      //     "primary": "#007bff",
      //     "secondary": "#6c757d",
      //     "success": "#28a745",
      //     "last_update": "2024-11-10T17:27:13.430Z",
      //     "__v": 0
      // }
      setFormVal((pre) => ({
        ...pre,
        companyName: data.company_name,
        favIconUrl: data.fav_icon,
        fontVal: data.font_family,
        primaryVal: data.primary,
        secondaryVal: data.secondary,
        successVal: data.success,
      }))
    }

  }
  const submitForm = () => {
    if (!fontVal.trim()) {
      setFormVal({
        ...formVal,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: "Font Family is required"
      })
    } else if (!primaryVal.trim()) {
      setFormVal({
        ...formVal,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: "Primary color is required"
      })
    } else if (!secondaryVal.trim()) {
      setFormVal({
        ...formVal,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: "Secondary color is required"
      })
    } else {
      formSubmitApiCall()
    }
  }

  const formSubmitApiCall = () => {
    const method: string = "GET";
    const url: string = "category/get/parent/category";
    const data: any = {
      "font_family": fontVal,
      "primary": primaryVal,
      "secondary": secondaryVal,
      "success": successVal
    }
    axiosApiCallFun(method, url, data, "formSubmitReq")
  }

  const axiosApiCallFun = async (method: string, url: string, data: any, type: string): Promise<void> => {
    try {
      const response = await HttpRequest({ method, url, data });
      switch (type) {
        case "formSubmitReq":
          formSubmitResFun(response)
          break;
        case "getThemeReq":
          getThemeResFun(response)
          break;
        default:
          break;
      }
    } catch (error) {
      setFormVal((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }

  const formSubmitResFun = (response) => {
    const message = response.response_message ? response.response_message : "Something went wrong";
    setFormVal({
      ...formVal,
      openSnakbar: true,
      openSnakbarType: "success",
      openSnakbarMsg: message
    })
  }
  const handleChange = (e: any, state: string): void => {
    // setFontVal(e.target.value)
    setFormVal({
      ...formVal,
      [state]: e.target.value,
      submitDisable: false
    })
  }
  const handleChangeFile = (event) => {
    const selectedFile = event.target.files[0];
    setFormVal((pre) => ({
      ...pre,
      favIcon: selectedFile,
      submitDisable: false
    }))

  }
  return (
    <div>
      <MySnackbar open={openSnakbar} type={openSnakbarType} variant={"filled"} message={openSnakbarMsg} duration={3000} handleClose={() => setFormVal((pre) => ({ ...pre, openSnakbar: false }))} />

      <div className='jr-card d-flex justify-content-between align-items-center'>
        <h4 className='bold'>Site Setting</h4>
      </div>

      <div className='jr-card'>
        <div>
          <TextField
            variant='outlined'
            label="Site Name"
            value={companyName}
            onChange={(e) => handleChange(e, "companyName")}
            required
            fullWidth
          />
        </div>

        <div className='mt-3'>
          <TextField
            variant='outlined'
            label="Font Family"
            value={fontVal}
            onChange={(e) => handleChange(e, "fontVal")}
            required
            fullWidth
          />
        </div>

        <div className='row mt-3'>
          {/* favIconUrl */}
          <div className={favIconUrl ? 'col-10' : "col-12"}>
            <TextField
              // ref={imageInput}
              id='ChildCategoryImg'
              type="file"
              label="Icon"
              variant="outlined"
              onChange={handleChangeFile}
              // value={ChildCategoryImg}
              InputLabelProps={{ shrink: true }}
              fullWidth
              inputProps={{ accept: 'image/*' }}  // Accept only image files
            // error={imgInputErr}
            // helperText={imgInputErr ? "This field is required" : null}
            />
          </div>
          {favIconUrl ? <div className='col-2 d-flex  justify-content-center'>
            <img src={favIconUrl} width={50} height={50} />
          </div> : null}
        </div>
        <div className='row mt-3'>
          <div className='col-10'>
            <TextField
              variant='outlined'
              label="Primary Color"
              value={primaryVal}
              onChange={(e) => handleChange(e, "primaryVal")}
              required
              fullWidth
            />
          </div>
          <div className='col-2 row align-items-center justify-content-center'>
            <div className='rounded' style={{ width: 50, height: 40, backgroundColor: primaryVal }}></div>
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-10'>
            <TextField
              variant='outlined'
              label="Secondary Color"
              value={secondaryVal}
              onChange={(e) => handleChange(e, "secondaryVal")}
              required
              fullWidth
            />
          </div>
          <div className='col-2 row align-items-center justify-content-center'>
            <div className='rounded' style={{ width: 50, height: 40, backgroundColor: secondaryVal }}></div>
          </div>
        </div>

        <div className='row mt-3'>
          <div className='col-10'>
            <TextField
              variant='outlined'
              label="Success Color"
              value={successVal}
              onChange={(e) => handleChange(e, "successVal")}
              fullWidth
            />
          </div>
          <div className='col-2 row align-items-center justify-content-center'>
            <div className='rounded' style={{ width: 50, height: 40, backgroundColor: successVal }}></div>
          </div>
        </div>

        <div className='d-flex justify-content-end mt-5'>
          <Button
            onClick={() => submitForm()}
            variant='contained'
            color='success'
            disabled={submitDisable}
          >Submit</Button>
        </div>
      </div>
    </div>
  )
}

export default Index