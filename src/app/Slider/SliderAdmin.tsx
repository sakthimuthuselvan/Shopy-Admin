import React, { useEffect, useState } from 'react';
import HttpRequest from '../../Utilities/ApiCall/HttpRequest';
import MUIDataTable from "mui-datatables";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import MySnackbar from '../../AlertShow/Alert';
import Loader from '../../Utilities/Loader/Loader';

interface AlertData {
  showLoader: boolean;
  openSnackbar: boolean;
  openSnackbarType: string;
  openSnackbarMsg: string;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  category_img: string;
}

interface Slider {
  _id: string;
  image: string;
  category: {
    _id: string,
    name: string
  };
}

const SliderAdmin: React.FC = () => {
  const [headerData] = useState([
    {
      name: "categoryImage",
      label: "Ad Image",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "categoryVal",
      label: "Category",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "action",
      label: " ",
      options: {
        filter: false,
        sort: false,
      }
    }
  ]);

  const [columnData, setColumnData] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Slider | null>(null);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  // const [sliderList, setSliderList] = useState<Slider[]>([]);
  // const [submitDisabled, setSubmitDisabled] = useState(false);
  const [categoryVal, setCategoryVal] = useState<Category | null>(null);
  const [categoryValErr, setCategoryValErr] = useState(false);
  // const [imagePath, setImagePath] = useState<string>("");
  const [isCheck, setIsCheck] = useState<boolean>(false);
  const [imageVal, setImageVal] = useState<any>(null);
  const [imageValErr, setImageValErr] = useState<boolean>(false);
  // const [openImgDialog, setOpenImgDialog] = useState<boolean>(false);
  const [imageViewDialog, setImageViewDialog] = useState<boolean>(false);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  const [alertData, setAlertData] = useState<AlertData>({
    showLoader: false,
    openSnackbar: false,
    openSnackbarType: '',
    openSnackbarMsg: ''
  });



  useEffect(() => {
    initialApiCall();
  }, []);

  const initialApiCall = async (): Promise<void> => {
    const method: string = "GET";
    const cate_url: string = "category/get/parentCategory";
    const slider_url: string = "slider/get/slider/banner";

    setAlertData((pre) => ({ ...pre, showLoader: true }));

    try {
      const cate_response = await HttpRequest({ method, url: cate_url, data: {} });
      const slider_response = await HttpRequest({ method, url: slider_url, data: {} });

      setCategoryList(() => {
        frameTableFun(slider_response.response_data, cate_response.response_data);
        // setSliderList(slider_response.response_data);
        return cate_response.response_data
      });


      setAlertData((pre) => ({ ...pre, showLoader: false }));
    } catch (error) {
      setAlertData((pre) => ({
        ...pre,
        showLoader: false,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message || "Something went wrong",
      }));
    }
  };

  const frameTableFun = (sliders: Slider[], category_list: Category[]) => {
    const formattedData = sliders.map((item: any) => {
      return {
        categoryImage: <img src={item.image} alt="Redundant" width={80} height={80} />,
        categoryVal: item.category && item.category.name ? item.category.name : "-",
        action: (
          <div>
            <IconButton className='mr-2' onClick={() => handleEditClick(item, category_list)}>
              <EditIcon className="text-primary" />
            </IconButton>
            <IconButton onClick={() => handleDeleteClick(item)}>
              <DeleteIcon className="text-danger" />
            </IconButton>
          </div>
        )
      };
    });

    setColumnData(formattedData);
  };


  const handleEditClick = (data: Slider, category_list: Category[]) => {
    const category = category_list.find((cat) => cat._id === data.category._id) || null;
    if (!category_list || category_list.length === 0) {
      return;
    }

    setSelectedItem(data);
    setOpenDialog(true);
    setCategoryVal(category);
    setIsEdit(true)
    // setImagePath(data.image)
    setIsCheck(false)
  };


  const handleDeleteClick = (data: Slider) => {
    // Implement delete functionality
    setDeleteDialog(true)
    setSelectedItem(data);

  };


  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCategoryChange = (event: any, newValue: Category | null) => {
    setCategoryVal(newValue);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageVal(event.target.files[0]);
      setImageValErr(false);
      setIsCheck(true)
    }
  };


  const editAPiCall = async (image_url: string): Promise<void> => {
    const method = "PUT";
    const url: string = `slider/update/slider/banner/${selectedItem?._id}`;
    const data: any = {
      "image": image_url,
      "category": categoryVal?._id ? categoryVal._id : selectedItem?.category
    }

    try {
      const response = await HttpRequest({ method, url, data });
      setAlertData((pre) => ({
        ...pre,
        showLoader: false,
        openSnackbar: true,
        openSnackbarType: 'success',
        openSnackbarMsg: response.response_message ? response.response_message : "Something went wrong"
      }))
      initialApiCall()
    } catch (error) {
      setAlertData((pre) => ({
        ...pre,
        showLoader: false,
        openSnackbar: true,
        openSnackbarType: 'error',
        openSnackbarMsg: error.response_message ? error.response_message : "Something went wrong"
      }))
    }
  }

  const addAPiCallFun = async (image_url: string): Promise<void> => {
    const method = "POST";
    const url: string = "slider/create/banner";
    const data: any = {
      "image": image_url ? image_url : "",
      "category": categoryVal?._id || ""
    }

    try {
      const response = await HttpRequest({ method, url, data });
      setAlertData((pre) => ({
        ...pre,
        showLoader: false,
        openSnackbar: true,
        openSnackbarType: 'success',
        openSnackbarMsg: response.response_message ? response.response_message : "Something went wrong"
      }))
      initialApiCall()
    } catch (error) {
      setAlertData((pre) => ({
        ...pre,
        showLoader: false,
        openSnackbar: true,
        openSnackbarType: 'error',
        openSnackbarMsg: error.response_message ? error.response_message : "Something went wrong"
      }))
    }
  }

  const imageApiCallFun = async (): Promise<void> => {
    const formData = new FormData();
    formData.append('image', imageVal);
    const method: string = "POST";
    const url: string = "single/image/upload";
    const data: any = formData

    setAlertData((pre) => ({
      ...pre,
      showLoader: true
    }))
    try {
      const response = await HttpRequest({ method, url, data });
      // setImagePath((pre) => {
        if (isEdit === false) {
          addAPiCallFun(response.imageUrl)
        } else {
          editAPiCall(response.imageUrl)
        }

        setAlertData((pre) => ({
          ...pre,
          showLoader: false
        }))
      //   return response.imageUrl
      // })
    } catch (error) {
      setAlertData((pre) => ({
        ...pre,
        showLoader: false,
        openSnackbar: true,
        openSnackbarType: 'error',
        openSnackbarMsg: error.response_message ? error.response_message : "Something went wrong"
      }))
    }
  }

  const handleSubmit = () => {
    // Implement submit functionality
    if (!categoryVal || (categoryVal && Object.keys(categoryVal).length === 0)) {
      setCategoryValErr(true)
      document.getElementById("categoryVal")?.focus()
    } else {

      if (isEdit === false) {
        imageApiCallFun()
      } else if (isEdit === true && isCheck === true) {
        imageApiCallFun()
      } else {
        let img = selectedItem && selectedItem.image ? selectedItem.image : ""
        editAPiCall(img)
      }
    };
  }


  const handleAddClick = () => {
    setOpenDialog(true);
    setIsEdit(false);
    setCategoryVal(null);
    setImageVal(null);
    setIsCheck(false)
  };

  const openDialogHtmlBuild = (): JSX.Element => {
    return (
      <Dialog fullWidth maxWidth="md" open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle className="border fs-15 bold border-primary text-white bg-primary d-flex justify-content-between align-items-center mb-3">
          {isEdit ? 'Edit Ads Image Card' : 'Add New Ads Image Card'}
          <IconButton onClick={handleCloseDialog}>
            <CancelIcon className="text-white" />
          </IconButton>
        </DialogTitle>
        <DialogContent className='row'>
          <div className='col-12 mt-3'>
            <Autocomplete
              options={categoryList}
              getOptionLabel={(option) => option.name}
              value={categoryVal}
              onChange={handleCategoryChange}
              fullWidth
              renderInput={(params) => <TextField {...params} label="Category" error={categoryValErr} />}
            />
          </div>

          <div className={`mt-3 ${isEdit ? "col-10" : "col-12"}`}>
            <TextField
              type="file"
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: 'image/*' }}
              onChange={handleFileChange}
              error={imageValErr}
              helperText={imageValErr ? 'This field is required' : null}
            />
          </div>
          {isEdit ? <div className='col-2 d-flex align-items-center justify-content-center'>
            <IconButton onClick={() => viewImageDialog()}><RemoveRedEyeIcon className='text-primary' /></IconButton>
          </div> : null}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const viewImageDialog = (): void => {
    setImageViewDialog(true)
  }

  const imageViewDialogHtmlBuild = (): JSX.Element => {
    return (
      <Dialog
        fullWidth
        maxWidth={"md"}
        open={imageViewDialog}
      >
        <DialogTitle className='border fs-15 bold border-primary text-white bg-primary d-flex justify-content-between align-items-center mb-3' >
          {"View Image"}
          <IconButton onClick={() => setImageViewDialog(false)}><CancelIcon className='text-white' /></IconButton>
        </DialogTitle>
        <DialogContent className='d-flex justify-content-center'>

          {selectedItem && Object.keys(selectedItem).length > 0 ?
            <img src={selectedItem.image} alt='ad_image_card' height={"400px"} />
            : null
          }
        </DialogContent>
      </Dialog>
    )
  }

  const confirmDeleteBtnClick = async (): Promise<void> => {
    const method: string = "DELETE";
    const slider_url: string = `slider/delete/banner/${selectedItem?._id}`;

    setAlertData((pre) => ({ ...pre, showLoader: true }));

    try {
      const response = await HttpRequest({ method, url: slider_url, data: {} });
      setAlertData((pre) => ({
        ...pre, showLoader: false,
        openSnakbar: true,
        openSnakbarType: "success",
        openSnakbarMsg: response.response_message ?? "Something went wrong"
      }));
      setDeleteDialog(false)
      initialApiCall();
    } catch (error) {
      setAlertData((pre) => ({
        ...pre,
        showLoader: false,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message || "Something went wrong",
      }));
    }
  };

  const deleteHtmlBuild = () => {
    return (
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
            Are you sure to want to delete this?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button className='text-danger' onClick={() => confirmDeleteBtnClick()} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const options = {
    responsive:"scroll",
    filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRowsHideCheckboxes: false,
    selectableRows: "none",
    print: false,
    dowload: false
  };


  return (
    <div>
      <Loader open={alertData.showLoader} />
      <MySnackbar
        open={alertData.openSnackbar}
        type={alertData.openSnackbarType}
        variant="filled"
        message={alertData.openSnackbarMsg}
        duration={3000}
        handleClose={() => setAlertData((prev) => ({ ...prev, openSnackbar: false }))}
      />

      <div className="jr-card d-flex justify-content-between align-items-center">
        <h4 className="bold">Slider</h4>
        <Button variant="contained" size="small" className="bg-primary" onClick={handleAddClick}>
          Add
        </Button>
      </div>
      <MUIDataTable
        data={columnData}
        columns={headerData}
        options={options}
      />


      {openDialog === true && openDialogHtmlBuild()}
      {imageViewDialog === true && imageViewDialogHtmlBuild()}
      {deleteDialog === true && deleteHtmlBuild()}


    </div>
  );
};

export default SliderAdmin;
