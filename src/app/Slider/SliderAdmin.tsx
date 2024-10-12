import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, IconButton, TextField, Typography } from '@mui/material';
import HttpRequest from '../../Utilities/ApiCall/HttpRequest';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MuiTable from '../Common/MuiTable';
import CancelIcon from '@mui/icons-material/Cancel';
import MySnackbar from '../../AlertShow/Alert';
import Loader from '../../Utilities/Loader/Loader';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { base_url } from '../EnvImport/Index';

interface state {
  showLoader: boolean;
  openSnakbar: boolean;
  openSnakbarType: string;
  openSnakbarMsg: string;
  openDialog: boolean;
  isEdit: boolean;
  selectedItem: any;
  smallImageVal: any;
  smallImageValErr: boolean;
  largeImageVal: any;
  largeImageValErr: boolean;
  isCheck: boolean;
  submitDisable: boolean;
  deleteDialog: boolean;
  headerData: any;
  columnData: any;

  image1: boolean;
  image2: boolean;
  smallImgPath: string;
  largeImgPath: string;

  navigatePath: string;
  navigatePathErr: boolean;
  imgInputErr: boolean;
  uploadImgPath: any[];
  baseUrl: string;
  imageViewDialog: boolean;
  index: number;
  categoryList: any[];
  categoryVal: any;
  categoryValErr: boolean;
}

const CardImage: React.FC = () => {
  const imageInputSmall = useRef<HTMLInputElement>(null);
  const imageInputLarge = useRef<HTMLInputElement>(null);

  const navigateInputFocus = useRef<HTMLInputElement>(null);
  const baseUrlPath: string = base_url ? base_url : '';

  const [state, setState] = useState<state>({
    headerData: [

      {
        accessorKey: 'catgoryImage',
        header: 'Ad Image',
        size: 150,
        enableClickToCopy: false,
      },
      {
        accessorKey: 'navigatePath', //access nested data with dot notation
        header: 'Navigate Path',
        size: 150,
      },
      {
        accessorKey: 'action', //normal accessorKey
        header: 'Action',
        size: 200,
        enableSorting: false,
        enableColumnActions: false,
        enableClickToCopy: false,
      },
    ],
    columnData: [],
    showLoader: false,
    openSnakbar: false,
    openSnakbarType: "",
    openSnakbarMsg: "",
    openDialog: false,
    isEdit: false,
    selectedItem: {},
    imgInputErr: false,
    navigatePath: "",
    navigatePathErr: false,
    smallImageVal: {},
    largeImageVal: {},
    isCheck: false,
    smallImageValErr: false,
    largeImageValErr: false,
    submitDisable: false,
    deleteDialog: false,
    uploadImgPath: [],
    baseUrl: baseUrlPath,
    imageViewDialog: false,
    index: 0,

    image1: false,
    image2: false,
    smallImgPath: "",
    largeImgPath: "",
    categoryList: [],
    categoryVal: null,
    categoryValErr: false,
  })
  const [shouldCallApi, setShouldCallApi] = useState<Boolean>(false)
  const { showLoader, openSnakbarType, openSnakbar, openSnakbarMsg, openDialog, isEdit, selectedItem, imgInputErr, navigatePath, navigatePathErr, smallImageVal, isCheck, smallImageValErr, submitDisable, deleteDialog, columnData, headerData, uploadImgPath, baseUrl, imageViewDialog, largeImageVal, largeImageValErr, index, image1, image2, smallImgPath, largeImgPath, categoryList, categoryVal, categoryValErr } = state;


  useEffect(() => {
    listApiCall();
    categoryListApiCall()
  }, []);

  const categoryListApiCall = async (): Promise<void> => {
    const method: string = "GET";
    const url: string = "category/get/parentCategory";
    const data: any = {}
    setState((pre) => ({ ...pre, showLoader: true }))
    try {
      const response = await HttpRequest({ method, url, data });
      console.log(response.response_data);
      setState((pre) => ({ ...pre, showLoader: false, categoryList: response.response_data }))

    } catch (error) {
      console.log(error.error_response);
      setState((pre) => ({
        ...pre,
        showLoader: false,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }

  useEffect(() => {
    // Call the API only when uploadImgPath is not empty
    if (shouldCallApi) {
      if (isEdit) {
        if (smallImgPath || largeImgPath) {
          editAPiCall()
          console.log("edit APi call");
        }
      } else {
        if (smallImgPath && largeImgPath) {
          AddAPiCall();
        }
      }
      setShouldCallApi(false)
      console.log("========1111", shouldCallApi);

    }
    console.log("========22222", shouldCallApi);


  }, [smallImgPath, largeImgPath]);


  const listApiCall = async (): Promise<void> => {
    const method: string = "GET";
    const url: string = "slider/get/slider/banner";
    const data: any = {}
    setState((pre) => ({ ...pre, showLoader: true }))
    try {
      const response = await HttpRequest({ method, url, data });
      console.log(response.response_data);
      setState((pre) => ({ ...pre, showLoader: false }))
      frameTableFun(response.response_data)
    } catch (error) {
      console.log(error.error_response);
      setState((pre) => ({
        ...pre,
        showLoader: false,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }



  const frameTableFun = (data: any): void => {
    // parentCategory,catgoryImage,childCategoryName,description,action
    const frameColumnData = data.map((item: any): any => {
      let finded: any = categoryList.find((data)=> data._id === item.navigate_category)

      let obj: any = {
        catgoryImage: <img src={item.sm_img} alt='ad_image_card' width={80} height={80} />,
        navigatePath: finded && finded.name ? finded.name : "-",
        action: <div>
          <IconButton onClick={() => editBtnClick(item)}><EditIcon className='text-primary' /></IconButton>
          <IconButton onClick={() => deleteBtnClick(item)}> <DeleteIcon className='text-danger' /></IconButton>
        </div>
      }

      return obj;
    })

    setState((pre) => ({
      ...pre,
      columnData: frameColumnData
    }))
  }
  const editBtnClick = (data: any): void => {
    console.log(data);

    setState((pre) => ({
      ...pre,
      selectedItem: data,
      isEdit: true,
      isCheck: false,
      navigatePath: data.navigate_path,
      openDialog: true,
      image1: false,
      image2: false,
      smallImgPath: "",
      largeImgPath: ""
    }))
  }
  const deleteBtnClick = (data: any): void => {
    setState((pre) => ({
      ...pre,
      deleteDialog: true,
      selectedItem: data
    }))
  }

  const addBtnClickFun = (): void => {
    setState((pre) => ({
      ...pre,
      openDialog: true,
      isEdit: false,
      navigatePath: "",
      smallImageValErr: false,
      smallImageVal: {},
      largeImageVal: {},
      largeImageValErr: false,
      navigatePathErr: false,
      imgInputErr: false,
      submitDisable: false,
      image1: false,
      image2: false,
      smallImgPath: "",
      largeImgPath: ""
    }))
  }

  const handleFileChange = (event: any, type: string): void => {
    const selectedFile = event.target.files[0]
    {
      if (type === "small") {
        setState((pre) => ({
          ...pre,
          smallImageVal: selectedFile,
          smallImageValErr: false,
          isCheck: true,
          submitDisable: false,
          image1: true
        }))
      } else {
        setState((pre) => ({
          ...pre,
          largeImageVal: selectedFile,
          largeImageValErr: false,
          isCheck: true,
          image2: true,
          submitDisable: false
        }))
      }

    }

  };
  const handleChange = (e: any): void => {
    setState((pre) => ({
      ...pre,
      navigatePath: e.target.value,
      navigatePathErr: false
    }))
  }

  const categoryChange = (val) => {
    setState((pre) => ({
      ...pre,
      categoryVal: val ? val : {},
      categoryValErr: false
    }))
  }

  const confirmDeleteBtnClick = async (): Promise<void> => {
    const method = "DELETE";
    const url = `slider/delete/slider/banner/${selectedItem._id}`;
    const data = {}
    try {
      const response = await HttpRequest({ method, url, data });
      console.log(response);
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "success",
        openSnakbarMsg: response.response_message,
        deleteDialog: false
      }))
      listApiCall()
    } catch (error) {
      console.log(error.response_message);
      setState((pre) => ({
        ...pre,
        showLoader: false,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"
      }))
    }

  }


  const handleClose = (): void => {
    setState((pre) => ({
      ...pre,
      openDialog: false
    }))
  }

  const submitBtnClickFun = (): void => {
    if (categoryVal === null || (categoryVal && Object.keys(categoryVal).length === 0)) {
      setState((pre) => ({
        ...pre,
        categoryValErr: true
      }))
      // navigateInputFocus.current?.focus()
      document.getElementById("navigateInputFocus")?.focus()
    } else if (!smallImageVal || Object.keys(smallImageVal).length > 0) {
      setState((pre) => ({
        ...pre,
        smallImageVal: true
      }))
      imageInputSmall.current?.focus()

    } if (!largeImageVal || Object.keys(largeImageVal).length > 0) {
      setState((pre) => ({
        ...pre,
        largeImageVal: true
      }))
      imageInputLarge.current?.focus()

    } else {
      console.log("=============isEdit ", isEdit);
      console.log("============= isCheck", isCheck);
      if (isEdit && isCheck) {
        console.log("edit api call with imag");
        //img api call
        if (image1) {
          smallImgUpload()
        }
        if (image2) {
          largeImgUpload()
        }
        // imageUploadApiCall()

        // edit api call
      } else if (isEdit === false && isCheck === true) {
        console.log("addAPi call with imag");
        // image upload and add api call
        console.log("image1 ", image1);
        console.log("image2 ", image2);

        if (image1) {
          console.log("iamge 1");

          smallImgUpload()
        }
        if (image2) {
          console.log("iamge 2");

          largeImgUpload()
        }
        // imageUploadApiCall()
      } else {
        editAPiCall()
        console.log("edit api call without image api call");

      }
    }
  }

  const smallImgUpload = async (): Promise<void> => {
    const formData = new FormData();
    formData.append('image', smallImageVal);


    const method: string = "POST";
    const url: string = "single/image/upload";
    const data: any = formData
    try {
      const response = await HttpRequest({ method, url, data });
      console.log();
      setShouldCallApi(true)
      setState((pre) => ({
        ...pre,
        smallImgPath: response.imageUrl,
        openSnakbar: true,
        openSnakbarType: "success",
        openDialog: false
      }))
    } catch (error) {
      console.log(error.error_response);
      setState((pre) => ({
        ...pre,
        showLoader: false,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }



  const largeImgUpload = async (): Promise<void> => {
    const formData = new FormData();
    formData.append('image', largeImageVal);


    const method: string = "POST";
    const url: string = "single/image/upload";
    const data: any = formData
    try {
      const response = await HttpRequest({ method, url, data });
      setShouldCallApi(true)
      setState((pre) => ({
        ...pre,
        largeImgPath: response.imageUrl,
        openSnakbar: true,
        openSnakbarType: "success",
        openDialog: false
      }))
    } catch (error) {
      setState((pre) => ({
        ...pre,
        showLoader: false,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }


  const editAPiCall = async (): Promise<void> => {
    const method = "PUT";
    const url: string = `slider/update/slider/banner/${selectedItem._id}`;
    const data: any = {
      "sm_img": smallImgPath ? smallImgPath : selectedItem.sm_img,
      "lg_img": largeImgPath ? largeImgPath : selectedItem.lg_img,
      "navigate_category": categoryVal._id ? categoryVal._id : selectedItem.navigate_category

    }

    try {
      const response = await HttpRequest({ method, url, data });
      setState((pre) => ({
        ...pre,
        openDialog: false,
        openSnakbar: true,
        openSnakbarType: "success",
        openSnakbarMsg: response.response_message ? response.response_message : "Something went wrong"
      }))
      listApiCall()
    } catch (error) {
      setState((pre) => ({
        ...pre,
        showLoader: false,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }

  const AddAPiCall = async (): Promise<void> => {
    const method = "POST";
    const url: string = "slider/create/banner";
    const data: any = {
      "sm_img": smallImgPath ? smallImgPath : "",
      "lg_img": largeImgPath ? largeImgPath : "",
      "navigate_category": categoryVal._id ? categoryVal._id : ""
    }

    try {
      const response = await HttpRequest({ method, url, data });
      console.log(response);
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "success",
        openSnakbarMsg: response.response_message ? response.response_message : "Something went wrong",
        openDialog: false
      }))
      listApiCall()
    } catch (error) {
      console.log(error);
      setState((pre) => ({
        ...pre,
        showLoader: false,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }
  console.log(isEdit);


  const viewImageDialog = (num: number): void => {
    setState((pre) => ({
      ...pre,
      imageViewDialog: true,
      index: num
    }))
  }

  console.log("============================================= shouldCallApishouldCallApi", shouldCallApi);

  return (
    <div>
      <Loader open={showLoader} />

      <MySnackbar open={openSnakbar} type={openSnakbarType} variant={"filled"} message={openSnakbarMsg} duration={3000} handleClose={() => setState((pre) => ({ ...pre, openSnakbar: false }))} />
      <div className='jr-card d-flex justify-content-between align-items-center'>
        <h4 className='bold'>Slider</h4>
        {/* Button component with onClick event */}

        <Button
          variant="contained"
          size="small"
          className='bg-primary'
          onClick={addBtnClickFun} // Call the addBtnClickFun function when the button is clicked
        >
          Add
        </Button>
      </div>

      <div>
        <MuiTable
          headerData={headerData}
          columnData={columnData}
          options={""}
        />
      </div>


      <Dialog
        fullWidth
        maxWidth={"md"}
        open={openDialog}
      >
        <DialogTitle className='border fs-15 bold border-primary text-white bg-primary d-flex justify-content-between align-items-center mb-3' >
          {isEdit ? "Edit Ads Image Card " : "Add New Ads Image Card"}
          <IconButton onClick={handleClose}><CancelIcon className='text-white' /></IconButton>
        </DialogTitle>
        <DialogContent>

          <div className='mt-3'>
            {/* <TextField
              ref={navigateInputFocus}
              id="category_name"
              label="Navigate Path"
              variant="outlined"
              value={navigatePath}
              autoComplete='off'
              onChange={(e) => handleChange(e)}
              error={navigatePathErr}
              helperText={navigatePathErr ? "This field is required" : null}
              fullWidth
            /> */}
            <Autocomplete
              id='navigateInputFocus'
              ref={navigateInputFocus}
              disablePortal
              onChange={(e, val) => categoryChange(val)}
              options={categoryList}
              getOptionLabel={(item) => item.name}
              value={categoryVal}
              fullWidth
              renderInput={(params) => <TextField {...params} label="Category" error={categoryValErr} />}
            />
          </div>
          <div className='row'>
            <div className={isEdit ? "d-flex col-lg-10 col-md-10 col-sm-10" : ""}>
              <div className='mt-3 w-100'>
                <TextField
                  ref={imageInputSmall}
                  id='ChildCategoryImg'
                  type="file"
                  label="Small Screen Image"
                  variant="outlined"
                  onChange={(e) => handleFileChange(e, "small")}
                  // value={ChildCategoryImg}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  inputProps={{ accept: 'image/*' }}  // Accept only image files
                  error={smallImageValErr}
                  helperText={smallImageValErr ? "This field is required" : null}
                />
              </div>
            </div>

            {isEdit ? <div className='col-2 d-flex align-items-center justify-content-center'>
              <IconButton onClick={() => viewImageDialog(0)}><RemoveRedEyeIcon className='text-primary' /></IconButton>
            </div> : null}
          </div>

          <div className='row'>
            <div className={isEdit ? "d-flex col-lg-10 col-md-10 col-sm-10" : ""}>
              <div className='mt-3 w-100'>
                <TextField
                  ref={imageInputLarge}
                  id='ChildCategoryImg'
                  type="file"
                  label="Large Screen Image"
                  variant="outlined"
                  onChange={(e) => handleFileChange(e, "large")}
                  // value={ChildCategoryImg}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  inputProps={{ accept: 'image/*' }}  // Accept only image files
                  error={largeImageValErr}
                  helperText={largeImageValErr ? "This field is required" : null}
                />
              </div>
            </div>

            {isEdit ? <div className='col-2 d-flex align-items-center justify-content-center'>
              <IconButton onClick={() => viewImageDialog(1)}><RemoveRedEyeIcon className='text-primary' /></IconButton>
            </div> : null}
          </div>
        </DialogContent>
        <DialogActions >
          <div className='pr-3'>
            <Button variant="contained" size="medium" color='success'
              onClick={() => submitBtnClickFun()}
              className='mx-4 mb-3'
              disabled={submitDisable}
            >Submit </Button>
          </div>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          <Typography variant='h6'>Confirm Delete</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to want to delete {selectedItem.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setState((pre) => ({ ...pre, deleteDialog: false }))}>Cancel</Button>
          <Button className='text-danger' onClick={() => confirmDeleteBtnClick()} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        fullWidth
        maxWidth={"md"}
        open={imageViewDialog}
      >
        <DialogTitle className='border fs-15 bold border-primary text-white bg-primary d-flex justify-content-between align-items-center mb-3' >
          {"View Image"}
          <IconButton onClick={() => setState((pre) => ({ ...pre, imageViewDialog: false }))}><CancelIcon className='text-white' /></IconButton>
        </DialogTitle>
        <DialogContent>
          {Object.keys(selectedItem).length > 0 ?
            <img src={(index === 0 ? selectedItem.sm_img : selectedItem.lg_img)} alt='ad_image_card' width={"500px"} height={"500px"} />
            : null
          }

        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CardImage
