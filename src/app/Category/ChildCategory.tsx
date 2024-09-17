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


interface headerData {
  accessorKey: string;
  header: string
  size: number;
  enableSorting?: boolean;
  enableColumnActions?: boolean;
  enableClickToCopy?: boolean;
}
interface columnData {
  parentCategory: string;
  catgoryImage: string;
  childCategoryName: string;
  description: string;
  action: string;
}
interface Parent {
  _id: string;
  name: string;
  // Add other properties as needed
}

interface stateVariables {
  headerData: headerData[];
  columnData: columnData[];
  openDialog: boolean;
  isEdit: boolean;
  selectedItem: any;
  ChildCategoryName: string;
  ChildCategoryNameErr: boolean;
  ChildCategoryImgErr: boolean;
  submitDisable: boolean;
  deleteDialog: boolean;
  isCheck: boolean;
  description: string;
  descriptionErr: boolean;
  parentCategoryData: any[];
  parentVal: Parent;
  parentValErr: boolean;
  ChildCategoryImg: any;
  openSnakbar: boolean;
  openSnakbarType: string;
  openSnakbarMsg: string;
  showLoader: boolean;
  uploadImgPath: string;
  baseUrl: string;

}



const ChildCategory: React.FC = () => {
  // Define the initial state with an array of HeaderData
  const baseUrlPath: string = base_url;

  const parent = useRef<HTMLInputElement>(null);
  const child = useRef<HTMLInputElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const des = useRef<HTMLInputElement>(null);


  const [state, setState] = useState<stateVariables>({
    headerData: [
      {
        accessorKey: 'parentCategory', //access nested data with dot notation
        header: 'Parent Category',
        size: 150,
      },
      {
        accessorKey: 'catgoryImage',
        header: 'Category Image',
        size: 150,
        enableClickToCopy: false,
      },
      {
        accessorKey: 'childCategoryName', //access nested data with dot notation
        header: 'Child Category',
        size: 150,
      },
      {
        accessorKey: 'description', //access nested data with dot notation
        header: 'Description',
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
    openDialog: false,
    isEdit: false,
    selectedItem: {},
    ChildCategoryName: "",
    ChildCategoryNameErr: false,
    ChildCategoryImgErr: false,
    submitDisable: false,
    deleteDialog: false,
    isCheck: false,
    description: "",
    descriptionErr: false,
    parentCategoryData: [],
    parentVal: { _id: "", name: "" },
    parentValErr: false,
    ChildCategoryImg: {},
    openSnakbar: false,
    openSnakbarType: "",
    openSnakbarMsg: "",
    showLoader: false,
    uploadImgPath: "",
    baseUrl: baseUrlPath


  });

  const { headerData, columnData, openDialog, isEdit, selectedItem, ChildCategoryName, ChildCategoryNameErr, ChildCategoryImgErr, submitDisable, deleteDialog, isCheck, description, descriptionErr, parentCategoryData, parentVal, parentValErr, ChildCategoryImg, openSnakbar, openSnakbarType, openSnakbarMsg, showLoader, uploadImgPath, baseUrl } = state;
  // Function to handle the button click event
  const addBtnClickFun = (): void => {
    setState((pre) => ({
      ...pre,
      openDialog: true,
      isEdit: false,
      parentVal: { _id: "", name: "" },
      // categoryImg: "",
      ChildCategoryName: "",
      ChildCategoryNameErr: false,
      ChildCategoryImgErr: false,
      submitDisable: false
    }))
    // Implement the logic for adding a new item or perform any action
    console.log('Button clicked!');
  };

  useEffect(() => {
    console.log('Effect running');
    listApiCall();
    categoryDropdownList()
  }, []);

  useEffect(() => {
    if (uploadImgPath) {
      // Call the API only when uploadImgPath is not empty
      if (isEdit) {
        editAPiCall()
      } else {
        AddAPiCall();
      }
    }
  }, [uploadImgPath]);

  const categoryDropdownList = async (): Promise<void> => {
    const method: string = "GET";
    const url: string = "category/get/parent/category";
    const data: any = {}

    try {
      const response = await HttpRequest({ method, url, data});
      setState((pre) => ({
        ...pre,
        parentCategoryData: response.response_data
      }))
    } catch (error) {
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }

  const listApiCall = async (): Promise<void> => {
    const method: string = "GET";
    const url: string = "category/get/childCategory";
    const data: any = {}
    setState((pre) => ({ ...pre, showLoader: true }))
    try {
      const response = await HttpRequest({ method, url, data});
      console.log(response.response_data);
      setState((pre) => ({ ...pre, showLoader: false }))
      frameTableFun(response.response_data)
    } catch (error) {
      console.log(error.error_response);
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }

  const frameTableFun = (data): void => {
    // parentCategory,catgoryImage,childCategoryName,description,action
    const frameColumnData = data.map((item: any): any => {
      console.log("baseUrl+item.child_category_img", baseUrl + item.child_category_img);

      let obj: any = {
        parentCategory: item.parent_category_name.name,
        catgoryImage: <img src={baseUrl + item.child_category_img} alt='child_category_image' width={80} height={80} />,
        childCategoryName: item.child_category_name,
        description: item.description,
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
    setState((pre) => ({
      ...pre,
      selectedItem: data,
      isEdit: true,
      openDialog: true,
      parentVal: data.parent_category_name,
      ChildCategoryName: data.child_category_name,
      ChildCategoryImg: data.child_category_img,
      description: data.description
    }))
  }

  const deleteBtnClick = (data: any): void => {
    setState((pre) => ({
      ...pre,
      deleteDialog: true,
      selectedItem: data
    }))
  }

  const confirmDeleteBtnClick = async():Promise <void> => {
    const method = "DELETE";
    const url = `category/delete/childCategory/${selectedItem._id}`;
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
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"
      }))
    }

  }

  const handleChange = (e: any): void => {
    setState((pre) => ({
      ...pre,
      ChildCategoryName: e.target.value,
      ChildCategoryNameErr: false,
      submitDisable: false
    }))
  }

  const handleClose = (): void => {
    setState((pre) => ({
      ...pre,
      openDialog: false
    }))
  }

  const handleFileChange = (event: any): void => {
    const selectedFile = event.target.files[0]
    // Handle the selected file as needed
    if (selectedFile.size > 200 * 1024) {
      setState((pre) => ({
        ...pre,
        ChildCategoryImgErr: true
      }))
      // document.getElementById("ChildCategoryImg").value = ""
      // document.getElementById("ChildCategoryImg").focus()
    } else {
      setState((pre) => ({
        ...pre,
        ChildCategoryImg: selectedFile,
        ChildCategoryImgErr: false,
        isCheck: true,
        submitDisable: false
      }))
    }

  };

  const descriptionHandleChange = (e: any): void => {
    setState((pre) => ({
      ...pre,
      description: e.target.value,
      descriptionErr: false
    }))
  }

  const parentChange = (val: any) => {
    console.log(val)
    setState((pre) => ({
      ...pre,
      parentVal: val,
      parentValErr: false
    }))
  }
  const submitBtnClickFun = () => {
    console.log(parentVal)
    if (!parentVal || !parentVal._id) {
      setState((pre) => ({
        ...pre,
        parentValErr: true
      }))
      parent.current?.focus()
    } else if (!ChildCategoryName) {
      setState((pre) => ({
        ...pre,
        ChildCategoryNameErr: true
      }))
      child.current?.focus()
    } else if (!ChildCategoryImg) {
      setState((pre) => ({
        ...pre,
        ChildCategoryImgErr: true
      }))
      imageInput.current?.focus()
    } else if (!description) {
      setState((pre) => ({
        ...pre,
        descriptionErr: true
      }))
      des.current?.focus()
    } else {
      if (isEdit && isCheck) {
        console.log("edit api call with imag");
        //img api call
        imageUploadApiCall()

        // edit api call
      } else if (isEdit === false && isCheck === true) {
        console.log("addAPi call with imag");
        // image upload and add api call
        imageUploadApiCall()
      } else {
        editAPiCall()
        console.log("edit api call without image api call");

      }
    }
  }


  const imageUploadApiCall = async (): Promise<void> => {
    const formData = new FormData();
    formData.append('image', ChildCategoryImg);

    const method: string = "POST";
    const url: string = "single/image/upload";
    const data: any = formData
    const imageUpload: boolean = true
    try {
      const response = await HttpRequest({ method, url, data });
      console.log();
      setState((pre) => ({
        ...pre,
        uploadImgPath: response.imageUrl,
        openSnakbar: true,
        openSnakbarType: "success",
        openDialog: false
      }))
    } catch (error) {
      console.log(error.error_response);
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }

  const editAPiCall = async (): Promise<void> => {
    console.log("selectedItem ", selectedItem);

    const method = "PUT";
    const url: string = `category/update/childCategory/${selectedItem._id}`;
    const data: any = {
      "parent_category_id": parentVal._id,
      "child_category_name": ChildCategoryName,
      "child_category_img": uploadImgPath ? uploadImgPath : selectedItem.child_category_img,
      "description": description
    }
    try {
      const response = await HttpRequest({ method, url, data });
      console.log(response);
      setState((pre) => ({
        ...pre,
        openDialog: false,
        openSnakbar: true,
        openSnakbarType: "success",
        openSnakbarMsg: response.response_message ? response.response_message : "Something went wrong"
      }))
      listApiCall()
    } catch (error) {
      console.log(error);
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
    const url: string = "category/create/childCategory";
    const data: any = {
      "parent_category_id": parentVal._id,
      "child_category_name": ChildCategoryName,
      "child_category_img": uploadImgPath,
      "description": description
    }
    try {
      const response = await HttpRequest({ method, url, data});
      console.log(response);
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "success",
        openSnakbarMsg: response.response_message ? response.response_message : "Something went wrong"

      }))
      listApiCall()
    } catch (error) {
      console.log(error);
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }


  return (
    <div>
      <Loader open={showLoader} />

      <MySnackbar open={openSnakbar} type={openSnakbarType} variant={"filled"} message={openSnakbarMsg} duration={3000} handleClose={() => setState((pre) => ({ ...pre, openSnakbar: false }))} />

      <div className='jr-card d-flex justify-content-between align-items-center'>
        <h4 className='bold'>Child Category</h4>
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
          {isEdit ? selectedItem.parent_category_name.name : "Add New Category"}
          <IconButton onClick={handleClose}><CancelIcon className='text-white' /></IconButton>
        </DialogTitle>
        <DialogContent>
          <form>
            <div className='mt-3'>
              <Autocomplete
                ref={parent}
                disablePortal
                onChange={(e, val) => parentChange(val)}
                options={parentCategoryData}
                getOptionLabel={(item) => item.name}
                value={parentVal}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Parent Category" error={parentValErr} />}
              />
            </div>
            <div className='mt-3'>
              <TextField
                ref={child}
                id="category_name"
                label="Child Category Name"
                variant="outlined"
                value={ChildCategoryName}
                autoComplete='off'
                onChange={(e) => handleChange(e)}
                error={ChildCategoryNameErr}
                helperText={ChildCategoryNameErr ? "This field is required" : null}
                fullWidth
              />
            </div>

            <div className='mt-3'>
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
                error={ChildCategoryImgErr}
                helperText={ChildCategoryImgErr ? "This field is required" : null}
              />
            </div>

            <div className='mt-3'>
              <TextField
                ref={des}
                multiline
                rows={3}
                id="category_name"
                label="Description"
                variant="outlined"
                value={description}
                onChange={(e) => descriptionHandleChange(e)}
                error={descriptionErr}
                helperText={descriptionErr ? "This field is required" : null}
                fullWidth
              />
            </div>

          </form>
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

    </div>
  );
};

export default ChildCategory;
