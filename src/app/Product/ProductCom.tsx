import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormLabel, IconButton, TextField, Typography } from '@mui/material';
import HttpRequest from '../../Utilities/ApiCall/HttpRequest';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MuiTable from '../Common/MuiTable';
import CancelIcon from '@mui/icons-material/Cancel';
import MySnackbar from '../../AlertShow/Alert';
import Loader from '../../Utilities/Loader/Loader';
import moment from "moment"
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
import { base_url } from "../EnvImport/Index"
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
  isCheck1: boolean;
  isCheck2: boolean;
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
  parentCategoryList: any[];
  childCategoryList: any[];
  parentVal: any;
  parentValErr: boolean;
  childVal: any;
  childValErr: boolean;
  description: string;
  descriptionErr: boolean;
  productName: string;
  productNameErr: boolean;
  messure: string;
  messureErr: boolean;
  priceVal: string;
  priceValErr: boolean;
  totalQuantity: string;
  totalQuantityErr: boolean;
  multipleImages: any[];
  multipleImagesErr: boolean;
  multipleImgPath: any[];
  imageViewType: string;
  apicheck: number;
}

const ProductCom: React.FC = () => {
  const imageInput = useRef<HTMLInputElement>(null);
  const baseurlPath: string = base_url;

  const parent = useRef<HTMLInputElement>(null);
  const child = useRef<HTMLInputElement>(null);
  const productNameInput = useRef<HTMLInputElement>(null);
  const priceInput = useRef<HTMLInputElement>(null);
  const quantityInput = useRef<HTMLInputElement>(null);
  const mutipleImgInput = useRef<HTMLInputElement>(null);

  const descriptionInput = useRef<HTMLInputElement>(null);

  //   {
  //     "_id": "6609b5a1695d26adb5f24116",
  //     "parent_category_id": "65da0170dbb93ba9587f0a4a",
  //     "child_category_id": "660857794257728f4aa35dee",
  //     "product_name": "fhj",
  //     "messure": "2",
  //     "total_quantity": 23,
  //     "price": 123,
  //     "cover_image": "hkjkl",
  //     "product_images": [
  //         "09009"
  //     ],
  //     "currency": "ghkhjk",
  //     "description": "hjk",
  //     "createdAt": "2024-03-31T19:12:33.375Z",
  //     "updatedAt": "2024-03-31T19:12:33.375Z",
  //     "__v": 0
  // },
  const [state, setState] = useState<state>({
    headerData: [
      {
        accessorKey: 'productImg',
        header: 'Product Image',
        size: 150,
        enableClickToCopy: false,
      },
      {
        accessorKey: 'productName',
        header: 'Product Name',
        size: 150,
        enableHiding: false
      },
      {
        accessorKey: 'parentCategory',
        header: 'Parent Category',
        size: 150,
      },
      {
        accessorKey: 'childCategory',
        header: 'Child Category',
        size: 150,
        enableClickToCopy: false,
      },
      {
        accessorKey: 'totalQuantity',
        header: 'Total Quantity',
        size: 150,
      },
      {
        accessorKey: 'messure',
        header: 'Messure Type',
        size: 150,
      },
      {
        accessorKey: 'price',
        header: 'Price',
        size: 150,
      },
      {
        accessorKey: 'createdAt', //access nested data with dot notation
        header: 'Created At',
        size: 150,
      },
      {
        accessorKey: 'updatedAt', //access nested data with dot notation
        header: 'Updated At',
        show: false,
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
    isCheck1: false,
    isCheck2: false,
    imageValErr: false,
    submitDisable: false,
    deleteDialog: false,
    uploadImgPath: "",
    baseUrl: baseurlPath,
    imageViewDialog: false,
    parentCategoryList: [],
    childCategoryList: [],
    parentVal: { name: "" },
    parentValErr: false,
    childVal: { child_category_name: "" },
    childValErr: false,
    description: "",
    productName: "",
    productNameErr: false,
    messure: "",
    messureErr: false,
    priceVal: "",
    priceValErr: false,
    totalQuantity: "",
    totalQuantityErr: false,
    multipleImagesErr: false,
    multipleImages: [],
    descriptionErr: false,
    multipleImgPath: [],
    imageViewType: "",
    apicheck: 0 //add => 1
  })

  const { showLoader, openSnakbarType, openSnakbar, openSnakbarMsg, openDialog, isEdit, selectedItem, imgInputErr, navigatePath, navigatePathErr, imageVal, isCheck1, isCheck2, imageValErr, submitDisable, deleteDialog, columnData, headerData, uploadImgPath, imageViewDialog, childCategoryList, parentCategoryList, parentVal, parentValErr, childVal, childValErr, description, productName, productNameErr, messure, messureErr, priceVal, priceValErr, totalQuantity, totalQuantityErr, multipleImagesErr, multipleImages, descriptionErr, multipleImgPath, imageViewType, apicheck } = state;

  useEffect(() => {
    parentCategoryAPiCall()
  }, []);

  useEffect(() => {
    if (parentCategoryList.length > 0 && childCategoryList.length > 0) {
      listApiCall();
    }
  }, [parentCategoryList, childCategoryList])

  useEffect(() => {
    if (submitDisable === false && (uploadImgPath || multipleImgPath.length > 0)) {
      // Call the API only when uploadImgPath is not empty
      if (uploadImgPath && multipleImgPath.length > 0) {
        // two images updated
        console.log("1111111");

        if (isEdit) {
          editAPiCall()
          console.log("2222222");

        } else if (apicheck === 1) {
          // AddAPiCall();
          console.log("333333");

        }
      } else {
        if (isEdit) {
          console.log("4444444444");

          editAPiCall()
        } else if (apicheck === 1) {
          // AddAPiCall();
          console.log("5555555555555");

        }
      }


    }
  }, [multipleImgPath, uploadImgPath]);

  useEffect(() => {
    if (uploadImgPath !== "" && multipleImgPath.length > 0 && apicheck === 1) {
      AddAPiCall();
      setState((pre) => ({ ...pre, apicheck: 0 }))
    }
  }, [multipleImgPath, uploadImgPath]);

  const parentCategoryAPiCall = async (): Promise<void> => {
    const method: string = "GET";
    const url: string = "category/get/parentCategory";
    const data: any = {}
    setState((pre) => ({ ...pre, showLoader: true }))
    try {
      const response = await HttpRequest({ method, url, data });
      setState((pre) => ({
        ...pre,
        parentCategoryList: response.response_data
      }))
      childCategoryApiCall()

    } catch (error) {
      setState((pre) => ({
        ...pre,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }

  const childCategoryApiCall = async (): Promise<void> => {
    const method: string = "GET";
    const url: string = "category/get/childCategory";
    const data: any = {}
    setState((pre) => ({ ...pre, showLoader: true }))
    try {
      const response = await HttpRequest({ method, url, data });
      setState((pre) => ({
        ...pre,
        childCategoryList: response.response_data
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
    const url: string = "product/get/product";
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
    const frameColumnData = data.map((item: any): any => {
      let parent = parentCategoryList.find((each) => each._id === item.parent_category_id)
      let child = childCategoryList.find((each) => each._id === item.child_category_id)

      let obj: any = {
        productName: item.product_name ? item.product_name : "-",
        parentCategory: parent && parent.name ? parent.name : "-",
        childCategory: child && child.child_category_name ? child.child_category_name : "-",
        totalQuantity: item.total_quantity,
        messure: item.messure ? item.messure : "-",
        price: item.price,
        createdAt: item.createdAt ? moment(item.createdAt).format("ll") : "-",
        updatedAt: item.updatedAt ? moment(item.updatedAt).format("ll") : "-",
        catgoryImage: <img src={item.image} alt='ad_image_card' width={80} height={80} />,
        productImg: item.cover_image ? <img src={item.cover_image} alt='child_category_image' width={80} height={80} /> : "-",

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
    let parent = parentCategoryList.find((each) => each._id === data.parent_category_id)
    let child = childCategoryList.find((each) => each._id === data.child_category_id)

    setState((pre) => ({
      ...pre,
      selectedItem: data,
      isEdit: true,
      isCheck1: false,
      isCheck2: false,
      openDialog: true,
      parentVal: parent,
      parentValErr: false,
      childVal: child,
      childValErr: false,
      description: data.description,
      productName: data.product_name,
      productNameErr: false,
      messure: data.messure,
      messureErr: false,
      priceVal: data.price,
      priceValErr: false,
      totalQuantity: data.total_quantity,
      totalQuantityErr: false,
      multipleImagesErr: false,
      multipleImgPath: [],
      descriptionErr: false,
      submitDisable: true,
      apicheck: 0
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
      imageVal: {},
      imgInputErr: false,
      parentVal: { name: "" },
      parentValErr: false,
      childVal: { child_category_name: "" },
      childValErr: false,
      description: "",
      productName: "",
      productNameErr: false,
      messure: "",
      messureErr: false,
      priceVal: "",
      priceValErr: false,
      totalQuantity: "",
      totalQuantityErr: false,
      multipleImagesErr: false,
      multipleImages: [],
      descriptionErr: false,
      multipleImgPath: [],
      imageViewType: "",
      apicheck: 1
    }))
  }

  const handleFileChange = (event: any): void => {
    const selectedFile = event.target.files[0]
    // Handle the selected file as needed
    if (selectedFile.size > 1024 * 1024) {
      setState((pre) => ({
        ...pre,
        image: true
      }))
    } else {
      setState((pre) => ({
        ...pre,
        imageVal: selectedFile,
        imageValErr: false,
        isCheck1: true,
        submitDisable: false
      }))
    }

  };
  const handleChange = (e: any, state: string, error: string): void => {
    if (state === "priceVal" || state === "totalQuantity") {
      let number = e.target.value.replace(/\D/g, "")
      setState((pre) => ({
        ...pre,
        [state]: number,
        [error]: false,
        submitDisable: false
      }))
    } else {
      setState((pre) => ({
        ...pre,
        [state]: e.target.value,
        [error]: false,
        submitDisable: false
      }))
    }

  }

  const confirmDeleteBtnClick = async (): Promise<void> => {
    const method = "DELETE";
    const url = `product/delete/product/${selectedItem._id}`;
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

  const submitBtnClickFun = async (): Promise<void> => {

    if ((!parentVal || !parentVal.name) || Object.keys(parentVal).length === 0) {
      setState((pre) => ({
        ...pre,
        parentValErr: true
      }))
      parent?.current?.focus()
    } else if (!productName) {
      setState((pre) => ({
        ...pre,
        productNameErr: true
      }))
      productNameInput?.current?.focus()
    } else if (!priceVal) {
      setState((pre) => ({
        ...pre,
        priceValErr: true
      }))
      priceInput?.current?.focus()
    } else if (!totalQuantity) {
      setState((pre) => ({
        ...pre,
        totalQuantityErr: true
      }))
      quantityInput?.current?.focus()
    } else if (!imageVal) {
      setState((pre) => ({
        ...pre,
        imageValErr: true
      }))
      imageInput?.current?.focus()
    } else if (isCheck2 === true && multipleImages.length === 0) {
      console.log(multipleImages);

      setState((pre) => ({
        ...pre,
        multipleImagesErr: true
      }))
      mutipleImgInput?.current?.focus()
    } else if (!description) {
      setState((pre) => ({
        ...pre,
        descriptionErr: true
      }))
      descriptionInput?.current?.focus()
    } else {
      if (isEdit) {
        console.log("edit api call with single and multiple ");
        // both image api called
        if (isCheck1 && isCheck2) {
          await singleImageUploadApiCall()
          await multipleImgUploadApiCall()
        } else if (isCheck1) {
          console.log("edit api call with single image chaged");
          // single image called
          await singleImageUploadApiCall()
        } else if (isCheck2) {
          console.log("edit api call with multiple image chaged");
          // multiple image called
          await multipleImgUploadApiCall()
        } else {
          editAPiCall()
          console.log("edit api call without image api call");
        }
        // edit api call
      } else if (isEdit === false && isCheck1 === true && isCheck2 === true) {
        console.log("addAPi call with imag");
        // image upload and add api call
        setState((pre) => ({ ...pre, apicheck: 1 }))
        await singleImageUploadApiCall()
        await multipleImgUploadApiCall()
      }
    }

  }

  const multipleImgUploadApiCall = async (): Promise<void> => {
    const formData = new FormData();
    Object.values(multipleImages).forEach(file => {
      formData.append('images', file);
    });
    const method: string = "POST";
    const url: string = "multiple/image/upload";
    const data: any = formData
    try {
      const response = await HttpRequest({ method, url, data });
      setState((pre) => ({
        ...pre,
        multipleImgPath: response.filter((item) => item.imageUrl),
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
  const singleImageUploadApiCall = async (): Promise<void> => {
    setState((pre)=>({...pre,showLoader: true}))
    const formData = new FormData();
    formData.append('image', imageVal);

    const method: string = "POST";
    const url: string = "single/image/upload";
    const data: any = formData
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
    const url: string = `product/update/product/${selectedItem._id}`;
    const data: any = {
      "product_name": productName,
      "parent_category_id": parentVal._id,
      "child_category_id": childVal._id,
      "messure": messure,
      "total_quantity": Number(totalQuantity),
      "price": Number(priceVal),
      "cover_image": uploadImgPath ? uploadImgPath : selectedItem.cover_image,
      "product_images": multipleImgPath.length > 0 ? multipleImgPath.map((item) => item.imageUrl) : selectedItem.product_images,
      "currency": "INR",
      "description": description,
      "updatedAt": moment()
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
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message ? error.response_message : "Something went wrong"

      }))
    }
  }

  const AddAPiCall = async (): Promise<void> => {
    const method = "POST";
    const url: string = "product/create/product";
    const data: any = {
      "product_name": productName,
      "parent_category_id": parentVal._id,
      "child_category_id": childVal._id,
      "messure": messure,
      "total_quantity": Number(totalQuantity),
      "price": Number(priceVal),
      "cover_image": uploadImgPath,
      "product_images": multipleImgPath.map((item) => item.imageUrl),
      "currency": "INR",
      "description": description
    }
    try {
      const response = await HttpRequest({ method, url, data });
      setState((pre) => ({
        ...pre,
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

  const viewImageDialog = (type: string): void => {

    setState((pre) => ({
      ...pre,
      imageViewDialog: true,
      imageViewType: type
    }))
  }

  const handleChangeSelect = (val: any, state: string, error: string): void => {
    setState((pre) => ({
      ...pre,
      [state]: val,
      [error]: false,
      submitDisable: false
    }))
  }

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setState((pre) => ({
      ...pre,
      description: data,
      descriptionErr: false,
      submitDisable: false
    }))
  };

  const multipleImageHandleChange = (event: any): void => {
    const files = event.target.files;
    let isValid = true;

    for (let i = 0; i < files.length; i++) {
      const fileSize = files[i].size / 1024 / 1024; // Convert bytes to MB
      if (fileSize > 1) { // Check if file size exceeds 1 MB
        isValid = false;
        break;
      }
    }

    if (!isValid) {
      setState((pre) => ({
        ...pre,
        multipleImagesErr: true,
      }))
    } else {
      setState((pre) => ({
        ...pre,
        multipleImages: files,
        multipleImagesErr: false,
        isCheck2: true,
        submitDisable: false
      }))
    }
  }

  const inputfieldsRender = (): any => {
    return (
      <div className='row m-0'>
        <div className='col-lg-6 col-md-6 col-sm-12  m-0 my-2'>
          <Autocomplete
            ref={parent}
            disablePortal
            onChange={(e, val) => handleChangeSelect(val, "parentVal", "parentValErr")}
            options={parentCategoryList}
            getOptionLabel={(item) => item.name}
            value={parentVal}
            fullWidth
            renderInput={(params) => <TextField 
              {...params}
               label="Category" 
               error={parentValErr}
               required
               />}
          />
        </div>

        {/* <div className='col-lg-6 col-md-6 col-sm-12  m-0 my-2'>
          <Autocomplete
            ref={child}
            disablePortal
            onChange={(e, val) => handleChangeSelect(val, "childVal", "childValErr")}
            options={childCategoryList}
            getOptionLabel={(item) => item.child_category_name}
            value={childVal}
            fullWidth
            renderInput={(params) => <TextField {...params} label="Child Category" error={childValErr} />}
          />
        </div> */}

        <div className='col-lg-6 col-md-6 col-sm-12  m-0 my-2'>
          <TextField
            ref={productNameInput}
            label="Product Name"
            variant="outlined"
            value={productName}
            autoComplete='off'
            onChange={(e) => handleChange(e, "productName", "productNameErr")}
            error={productNameErr}
            helperText={productNameErr ? "This field is required" : null}
            fullWidth
            required
          />
        </div>

        <div className='col-lg-6 col-md-6 col-sm-12  m-0 my-2'>
          <TextField
            label="Messure"
            variant="outlined"
            value={messure}
            autoComplete='off'
            onChange={(e) => handleChange(e, "messure", "messureErr")}
            error={messureErr}
            helperText={messureErr ? "This field is required" : null}
            fullWidth
          />
        </div>

        <div className='col-lg-6 col-md-6 col-sm-12  m-0 my-2'>
          <TextField
            ref={priceInput}
            label="Price"
            variant="outlined"
            value={priceVal}
            autoComplete='off'
            onChange={(e) => handleChange(e, "priceVal", "priceValErr")}
            error={priceValErr}
            helperText={priceValErr ? "This field is required" : null}
            fullWidth
            required
          />
        </div>

        <div className='col-lg-6 col-md-6 col-sm-12  m-0 my-2'>
          <TextField
            ref={quantityInput}
            label="Total Quantity"
            variant="outlined"
            value={totalQuantity}
            autoComplete='off'
            onChange={(e) => handleChange(e, "totalQuantity", "totalQuantityErr")}
            error={totalQuantityErr}
            helperText={totalQuantityErr ? "This field is required" : null}
            fullWidth
            required
          />
        </div>


        <div className='row'>
          <div className={isEdit ? "d-flex col-lg-10 col-md-10 col-sm-10" : ""}>
            <div className='mt-3 w-100'>
              <TextField
                ref={imageInput}
                id='ChildCategoryImg'
                type="file"
                label="Cover Image"
                variant="outlined"
                onChange={handleFileChange}
                // value={ChildCategoryImg}
                InputLabelProps={{ shrink: true }}
                fullWidth
                inputProps={{ accept: 'image/*' }}  // Accept only image files
                error={imageValErr}
                helperText={imageValErr ? "This field is required" : "Maximum limit 1 mb"}
                required
              />
            </div>
          </div>

          {isEdit ? <div className='col-2 d-flex align-items-center justify-content-center'>
            <img onClick={() => viewImageDialog("single")} width={100} height={100} src={selectedItem.cover_image} alt='cover_image' className='pointer'/>
            {/* <IconButton ><RemoveRedEyeIcon className="text-primary" /></IconButton> */}
          </div> : null}
        </div>

        <div className='row'>
          <div className={isEdit ? "d-flex col-lg-10 col-md-10 col-sm-10" : ""}>
            <div className='mt-3 w-100'>
              <TextField
                ref={mutipleImgInput}
                type="file"
                label="Inner Images"
                variant="outlined"
                onChange={multipleImageHandleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                inputProps={{ multiple: true, accept: 'image/*' }}  // Accept only image files
                error={multipleImagesErr}
                helperText={multipleImagesErr ? "This field is required" : null}
                required
              />
            </div>
          </div>

          {isEdit ? <div className='col-2 d-flex align-items-center justify-content-center'>
            <IconButton onClick={() => viewImageDialog("multiple")}><RemoveRedEyeIcon className="text-primary" /></IconButton>
          </div> : null}
        </div>


        <div className='w-100 mt-5'>
          {descriptionErr ? <p className='text-danger'>{"This field is required"}</p> : null}
          <FormLabel>Description</FormLabel>
          <CKEditor
            editor={ClassicEditor}
            data={description}
            onChange={(event, editor) => handleEditorChange(event, editor)}
          />
        </div>


      </div>
    )
  }
  console.log(selectedItem.product_images);

  return (
    <div>
      <Loader open={showLoader} />

      <MySnackbar open={openSnakbar} type={openSnakbarType} variant={"filled"} message={openSnakbarMsg} duration={3000} handleClose={() => setState((pre) => ({ ...pre, openSnakbar: false }))} />
      <div className='jr-card d-flex justify-content-between align-items-center'>
        <h4 className='bold'>Product</h4>
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
          options={{
            initialState: { columnVisibility: {} },
          }}

        />
      </div>


      <Dialog fullWidth fullScreen open={openDialog}>
        <DialogTitle className='border fs-15 bold border-primary text-white bg-primary d-flex justify-content-between align-items-center mb-3' >
          {isEdit ? "Edit Ads Image Card " : "Add New Ads Image Card"}
          <IconButton onClick={handleClose}><CancelIcon className='text-white' /></IconButton>
        </DialogTitle>
        <DialogContent>
          {inputfieldsRender()}

          <div className='mt-3 d-flex justify-content-end'>
            <Button variant="contained" size="medium" color='success'
              onClick={() => submitBtnClickFun()}
              className='mx-4 mb-3'
              disabled={submitDisable}
            >Submit </Button>
          </div>

        </DialogContent>
        {/* <DialogActions > */}

        {/* </DialogActions> */}
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
          {imageViewType === "single" ?
            <img src={selectedItem.cover_image} alt='cover_image' width={500} height={500} />
            :

            <div className='d-flex'>
              {
                selectedItem.product_images && selectedItem.product_images.length > 0 && selectedItem.product_images.map((item) => {
                  console.log("itemitem ", item);
    
                  return (
                    <div className='border p-2 mx-2 shadow rounded'>
                      <img src={item} alt='images' width={200} height={200} />
                    </div>
     
                   )
                })
              }
            </div>
          }
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProductCom
