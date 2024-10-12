import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import MySnackbar from '../../AlertShow/Alert';
import HttpRequest from '../../Utilities/ApiCall/HttpRequest';

interface formVal {
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
    fontVal: "",
    primaryVal: "",
    secondaryVal: "",
    successVal: "",
    openSnakbar: false,
    openSnakbarType: "",
    openSnakbarMsg: ""
  })

  const { fontVal, primaryVal, secondaryVal, successVal, openSnakbarMsg, openSnakbar, openSnakbarType } = formVal;


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
    // console.log(e.target.value)

    // setFontVal(e.target.value)
    setFormVal({
      ...formVal,
      [state]: e.target.value
    })
  }

  return (
    <div>
      <MySnackbar open={openSnakbar} type={openSnakbarType} variant={"filled"} message={openSnakbarMsg} duration={3000} handleClose={() => setFormVal((pre) => ({ ...pre, openSnakbar: false }))} />

      <div className='jr-card d-flex justify-content-between align-items-center'>
        <h4 className='bold'>Theming</h4>
        <Button
          variant="contained"
          size="small"
          className='bg-primary'
        >
          Add
        </Button>
      </div>

      <div className='jr-card'>
        <div>
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
          <div className='col-11'>
            <TextField
              variant='outlined'
              label="Primary Color"
              value={primaryVal}
              onChange={(e) => handleChange(e, "primaryVal")}
              required
              fullWidth
            />
          </div>
          <div className='col-1 row align-items-center'>
            <div className='rounded' style={{ width: 40, height: 40, backgroundColor: primaryVal }}></div>
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-11'>
            <TextField
              variant='outlined'
              label="Secondary Color"
              value={secondaryVal}
              onChange={(e) => handleChange(e, "secondaryVal")}
              required
              fullWidth
            />
          </div>
          <div className='col-1 row align-items-center'>
            <div className='rounded' style={{ width: 40, height: 40, backgroundColor: secondaryVal }}></div>
          </div>
        </div>

        <div className='row mt-3'>
          <div className='col-11'>
            <TextField
              variant='outlined'
              label="Success Color"
              value={successVal}
              onChange={(e) => handleChange(e, "successVal")}
              fullWidth
            />
          </div>
          <div className='col-1 row align-items-center'>
            <div className='rounded' style={{ width: 40, height: 40, backgroundColor: successVal }}></div>
          </div>
        </div>

        <div className='d-flex justify-content-end mt-5'>
          <Button onClick={() => submitForm()} variant='contained' color='success'>Submit</Button>
        </div>
      </div>
    </div>
  )
}

export default Index