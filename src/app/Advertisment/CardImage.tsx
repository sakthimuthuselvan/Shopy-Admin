import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import HttpRequest from '../../Utilities/ApiCall/HttpRequest';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MuiTable from '../Common/MuiTable';
import CancelIcon from '@mui/icons-material/Cancel';
import MySnackbar from '../../AlertShow/Alert';
import Loader from '../../Utilities/Loader/Loader';
import { base_url } from '../EnvImport/Index';
import VisibilityIcon from '@mui/icons-material/Visibility';


interface state {
  showLoader: boolean;
  openSnakbar: boolean;
  openSnakbarType: string;
  openSnakbarMsg: string;
  openDialog: boolean;
  isEdit: boolean;
  selectedItem: any;
  imageVal: any;
  imageValErr: boolean;
  isCheck: boolean;
  submitDisable: boolean;
  deleteDialog: boolean;
  headerData: any;
  columnData: any;


  navigatePath: string;
  navigatePathErr: boolean;
  imgInputErr: boolean;
  uploadImgPath: string;
  baseUrl: string;
  imageViewDialog: boolean;
  categoryVal: any;
  categoryValErr: boolean;
  categoryList: any[]
}

const CardImage: React.FC = () => {
  const imageInput = useRef<HTMLInputElement>(null);
  const navigateInputFocus = useRef<HTMLInputElement>(null);
  const baseUrlPath: string = base_url;

  const [state, setState] = useState<state>({
    headerData: [

      {
        accessorKey: 'catgoryImage',
        header: 'Ad Image',
        size: 150,
        enableClickToCopy: false,
      },
      {
        accessorKey: 'category_name', //access nested data with dot notation
        header: 'Category Name',
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
    imageVal: {},
    isCheck: false,
    imageValErr: false,
    submitDisable: false,
    deleteDialog: false,
    uploadImgPath: "",
    baseUrl: baseUrlPath,
    imageViewDialog: false,
    categoryVal: null,
    categoryValErr: false,
    categoryList: []
  })
  const [checkAPiCall, setCheckApiCall] = useState(false)

  const { showLoader, openSnakbarType, openSnakbar, openSnakbarMsg, openDialog, isEdit, selectedItem, imgInputErr, navigatePath, navigatePathErr, imageVal, isCheck, imageValErr, submitDisable, deleteDialog, columnData, headerData, uploadImgPath, baseUrl, imageViewDialog, categoryVal, categoryValErr, categoryList } = state;


  useEffect(() => {
    categoryListApiCall()
    listApiCall();
  }, []);

  const categoryListApiCall = async (): Promise<void> => {
    const method: string = "GET";
    const url: string = "category/get/parentCategory";
    const data: any = {}
    setState((pre) => ({ ...pre, showLoader: true }))
    try {
      const response = await HttpRequest({ method, url, data });      
      setState((pre) => ({ ...pre, showLoader: false, categoryList: response.response_data }))

    } catch (error) {
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }
  useEffect(() => {
    if (uploadImgPath && checkAPiCall) {
      // Call the API only when uploadImgPath is not empty
      if (isEdit) {
        editAPiCall()
      } else {
        AddAPiCall();
      }
      setCheckApiCall(false)
    }
  }, [uploadImgPath]);


  const listApiCall = async (): Promise<void> => {
    const method: string = "GET";
    const url: string = "addvertisment/get/image/ads";
    const data: any = {}
    setState((pre) => ({ ...pre, showLoader: true }))
    try {
      const response = await HttpRequest({ method, url, data });
      setState((pre) => ({ ...pre, showLoader: false }))
      frameTableFun(response.response_data)
    } catch (error) {
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }



  const frameTableFun = (data: any): void => {    
    // parentCategory,catgoryImage,childCategoryName,description,action
    const frameColumnData = data.map((item: any): any => {
      let obj: any = {
        catgoryImage: <img src={item.image} alt='ad_image_card' width={80} height={80} />,
        category_name: (item.navigate_category && item.navigate_category.name )?? "-",
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

    const cate = categoryList.find((item)=> item._id === data.navigate_category._id)
    setState((pre) => ({
      ...pre,
      selectedItem: data,
      isEdit: true,
      isCheck: false,
      navigatePath: data.path,
      openDialog: true,
      categoryVal: cate
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
      imageValErr: false,
      imageVal: {},
      navigatePathErr: false,
      imgInputErr: false,
      submitDisable: false,
      categoryVal: null
    }))
  }

  const handleFileChange = (event: any): void => {
    const selectedFile = event.target.files[0]
    // Handle the selected file as needed

    setState((pre) => ({
      ...pre,
      imageVal: selectedFile,
      imageValErr: false,
      isCheck: true,
      submitDisable: false
    }))
  }

  const handleChange = (e): void => {
    setState((pre) => ({
      ...pre,
      navigatePath: e.target.value,
      navigatePathErr: false
    }))
  }

  const confirmDeleteBtnClick = async (): Promise<void> => {
    const method = "DELETE";
    const url = `addvertisment/delete/image/ads/${selectedItem._id}`;
    const data = {}
    try {
      const response = await HttpRequest({ method, url, data });
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "success",
        openSnakbarMsg: response.response_message,
        deleteDialog: false
      }))
      listApiCall()
    } catch (error) {
      setState((pre) => ({
        ...pre,
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
    if (!categoryVal || Object.keys(categoryVal).length === 0) {
      setState((pre) => ({
        ...pre,
        categoryValErr: true
      }))
      navigateInputFocus.current?.focus()
    } else if (!imageVal || Object.keys(imageVal).length > 0) {
      setState((pre) => ({
        ...pre,
        imgInputErr: true
      }))
      imageInput.current?.focus()

    } else {
      if (isEdit && isCheck) {
        //edit api call with imag
        imageUploadApiCall()
      } else if (isEdit === false && isCheck === true) {
        // addAPi call with imag
        imageUploadApiCall()
      } else {
        //edit api call without image api call
        editAPiCall()
      }
    }
  }

  const imageUploadApiCall = async (): Promise<void> => {
    const formData = new FormData();
    formData.append('image', imageVal);

    const method: string = "POST";
    const url: string = "single/image/upload";
    const data: any = formData
    setState((pre) => ({
      ...pre,
      showLoader: true
    }))
    try {
      const response = await HttpRequest({ method, url, data });
      setState((pre) => ({
        ...pre,
        showLoader: false,
        uploadImgPath: response.imageUrl,
        openSnakbar: true,
        openSnakbarType: "success",
        openDialog: false
      }))
      setCheckApiCall(true)
    } catch (error) {
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }

  const editAPiCall = async (): Promise<void> => {
    const method = "PUT";
    const url: string = `addvertisment/update/image/ads/${selectedItem._id}`;
    const data: any = {
      "image": uploadImgPath ? uploadImgPath : selectedItem.image,
      "navigate_category": categoryVal._id ? categoryVal._id : selectedItem.navigate_category._id
    }
    setState((pre) => ({
      ...pre,
      showLoader: true
    }))
    try {
      const response = await HttpRequest({ method, url, data });
      setState((pre) => ({
        ...pre,
        showLoader: false,
        openDialog: false,
        openSnakbar: true,
        openSnakbarType: "success",
        openSnakbarMsg: response.response_message ? response.response_message : "Something went wrong"
      }))
      listApiCall()
    } catch (error) {
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }

  const AddAPiCall = async (): Promise<void> => {
    const method = "POST";
    const url: string = "addvertisment/create/image/ads";
    const data: any = {
      "image": uploadImgPath,
      "navigate_category": categoryVal._id ? categoryVal._id : selectedItem.navigate_category._id
    }
    setState((pre) => ({ ...pre, showLoader: true }))
    try {
      const response = await HttpRequest({ method, url, data });
      setState((pre) => ({
        ...pre,
        showLoader: false,
        openSnakbar: true,
        openSnakbarType: "success",
        openSnakbarMsg: response.response_message ? response.response_message : "Something went wrong"

      }))
      listApiCall()
    } catch (error) {
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }

  const viewImageDialog = (): void => {
    setState((pre) => ({
      ...pre,
      imageViewDialog: true
    }))
  }

  const categoryChange = (val) => {
    setState((pre) => ({
      ...pre,
      categoryVal: val ? val : {},
      categoryValErr: false
    }))
  }

  return (
    <div>
      <Loader open={showLoader} />

      <MySnackbar open={openSnakbar} type={openSnakbarType} variant={"filled"} message={openSnakbarMsg} duration={3000} handleClose={() => setState((pre) => ({ ...pre, openSnakbar: false }))} />
      <div className='jr-card d-flex justify-content-between align-items-center'>
        <h4 className='bold'>Card Advertisment</h4>
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
                  ref={imageInput}
                  id='ChildCategoryImg'
                  type="file"
                  label="Choose File"
                  variant="outlined"
                  onChange={handleFileChange}
                  // value={ChildCategoryImg}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  inputProps={{ accept: 'image/*' }}  // Accept only image files
                  error={imgInputErr}
                  helperText={imgInputErr ? "This field is required" : null}
                />
              </div>
            </div>
            {isEdit ? <div className='col-2 d-flex align-items-end justify-content-center'>
              <IconButton onClick={() => viewImageDialog()}><VisibilityIcon  className="text-primary"/></IconButton>
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
        <DialogTitle id="alert-dialog-title subtitle1">
          <Typography>Confirm Delete</Typography>
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
          <img src={selectedItem.image} alt='ad_image_card' width={"100%"} height={"100%"} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CardImage
