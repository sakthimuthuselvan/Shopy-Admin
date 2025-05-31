import React, { useEffect, useState } from 'react'
import MySnackbar from '../../AlertShow/Alert'
import Loader from '../../Utilities/Loader/Loader';
import MUIDataTable from "mui-datatables";
import HttpRequest from '../../Utilities/ApiCall/HttpRequest';
import { Chip, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import moment from 'moment';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import HomeIcon from '@mui/icons-material/Home';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import RoomIcon from '@mui/icons-material/Room';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';

interface AlertData {
  showLoader: boolean;
  openSnackbar: boolean;
  openSnackbarType: string;
  openSnackbarMsg: string;
}

const Index: React.FC = () => {
  const [alertData, setAlertData] = useState<AlertData>({
    showLoader: false,
    openSnackbar: false,
    openSnackbarType: '',
    openSnackbarMsg: ''
  });
  const [orderList, setOrderList] = useState<any>([])
  const [openViewDialog, setOpenViewDialog] = useState<boolean>(false)
  const [selectedOrder, setSelectedOrder] = useState<any>({})
  const header: any = [
    {
      name: "user_name",
      label: "User Name",
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: "amount",
      label: "Amount (₹)",
      options: {
        filter: false,
      }
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          if (value === "Paid") {
            return (
              <Chip size='small' label="Paid" variant='outlined' className='border bg-success text-white px-2' />
            )
          } else if (value === "Pending") {
            return (
              <Chip size='small' label="Pending" variant='outlined' className='border bg-danger text-white px-2' />
            )
          } else {
            return "-"
          }
        }
      }
    },
    {
      name: "created_at",
      label: "Created At",
      options: {
        filter: true
      }
    },
    {
      name: "action",
      label: " ",
      options: {
        filter: false,
        viewcolumns: false
      }
    }
  ];
  const { openSnackbar, openSnackbarMsg, openSnackbarType } = alertData;


  useEffect(() => {
    getOrderListAPiCall()
  }, [])

  const getOrderListAPiCall = async (): Promise<void> => {
    const method: string = "GET";
    const url: string = "orders/get";
    const data: any = {}
    try {
      const response = await HttpRequest({ method, url, data });
      setAlertData((pre) => ({ ...pre, showLoader: false }));
      setOrderList(response.response_data || [])
    } catch (error) {

      setAlertData((pre) => ({
        ...pre,
        showLoader: false,
        openSnackbar: true,
        openSnackbarType: "error",
        openSnackbarMsg: error.response_message || "Something went wrong",
      }));
    }
  }


  const orderDetailView = (data: any): void => {
    setSelectedOrder(data)
    setOpenViewDialog(true)
  }

  const openViewDialogBuild = () => {
    const { firstName, address1, landMark, phoneNumber, district, state, country, pincode, address2 } = selectedOrder.shippingAddress;
    return (
      <Dialog
        fullWidth
        maxWidth={"md"}
        open={openViewDialog}
        fullScreen={window.innerWidth < 500 ? true : false}
      >
        <DialogTitle className='border fs-15 bold border-primary text-white bg-primary d-flex justify-content-between align-items-center mb-3' >
          {selectedOrder?.shippingAddress?.firstName ?? ""}
          <IconButton onClick={() => setOpenViewDialog(false)}><CancelIcon className='text-white' /></IconButton>
        </DialogTitle>
        <DialogContent className='mt-3'>
          <div className='row'>
            <div className='col-lg-4 col-md-4 col-sm-6 col-12 mt-3'>
              <div className='d-flex'>
                <PersonIcon className='me-2 text-primary' />
                <div>
                  <Typography>Ordered User Name</Typography>
                  <div className='fw-bold'>{firstName && firstName}</div>
                </div>
              </div>
            </div>

            <div className='col-lg-4 col-md-4 col-sm-6 col-12 mt-3'>
              <div className='d-flex'>
                <LocalActivityIcon className='me-2 text-primary' />
                <div>
                  <Typography>Order ID</Typography>
                  <div className='fw-bold'>{selectedOrder && selectedOrder.userOrderId ? selectedOrder.userOrderId : "-"}</div>
                </div>
              </div>
            </div>

            <div className='col-lg-4 col-md-4 col-sm-6 col-12 mt-3'>
              <div className='d-flex'>
                <CurrencyRupeeIcon className='me-2 text-primary' />
                <div>
                  <Typography>Total Amount</Typography>
                  <div className='fw-bold'>{selectedOrder && selectedOrder.amount ? selectedOrder.amount : "-"}</div>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-md-4 col-sm-6 col-12 mt-3'>
              <div className='d-flex'>
                <LocalPhoneIcon className='me-2 text-primary' />
                <div>
                  <Typography>Phone Number</Typography>
                  <div className='fw-bold'>{phoneNumber && phoneNumber}</div>
                </div>
              </div>
            </div>

            <div className='col-lg-4 col-md-4 col-sm-6 col-12 mt-3'>
              <div className='d-flex'>
                <PersonIcon className='me-2 text-primary' />
                <div>
                  <Typography>Login user</Typography>
                  <div className='fw-bold'>{selectedOrder.user_id && selectedOrder.user_id.name ? selectedOrder.user_id.name : ""}</div>
                </div>
              </div>
            </div>
            {address1 && <div className='col-lg-4 col-md-4 col-sm-6 col-12 mt-3'>
              <div className='d-flex'>
                <HomeIcon className='me-2 text-primary' />
                <div>
                  <Typography>Address 1</Typography>
                  <div className='fw-bold'>{address1 && address1}</div>
                </div>
              </div>
            </div>}

            {address2 && <div className='col-lg-4 col-md-4 col-sm-6 col-12 mt-3'>
              <div className='d-flex'>
                <HomeIcon className='me-2 text-primary' />
                <div>
                  <Typography>Address 2</Typography>
                  <div className='fw-bold'>{address2 && address2}</div>
                </div>
              </div>
            </div>}

            {landMark && <div className='col-lg-4 col-md-4 col-sm-6 col-12 mt-3'>
              <div className='d-flex'>
                <WhereToVoteIcon className='me-2 text-primary' />
                <div>
                  <Typography>Landmark</Typography>
                  <div className='fw-bold'>{landMark && landMark}</div>
                </div>
              </div>
            </div>}

            <div className='col-lg-4 col-md-4 col-sm-6 col-12 mt-3'>
              <div className='d-flex'>
                <RoomIcon className='me-2 text-primary' />
                <div>
                  <Typography>District</Typography>
                  <div className='fw-bold'>{district && district}</div>
                </div>
              </div>
            </div>

            <div className='col-lg-4 col-md-4 col-sm-6 col-12 mt-3'>
              <div className='d-flex'>
                <RoomIcon className='me-2 text-primary' />
                <div>
                  <Typography>State</Typography>
                  <div className='fw-bold'>{state && state}</div>
                </div>
              </div>
            </div>

            <div className='col-lg-4 col-md-4 col-sm-6 col-12 mt-3'>
              <div className='d-flex'>
                <RoomIcon className='me-2 text-primary' />
                <div>
                  <Typography>Country</Typography>
                  <div className='fw-bold'>{country && country}</div>
                </div>
              </div>
            </div>

            {pincode && <div className='col-lg-4 col-md-4 col-sm-6 col-12 mt-3'>
              <div className='d-flex'>
                <MyLocationIcon className='me-2 text-primary' />
                <div>
                  <Typography>Pincode</Typography>
                  <div className='fw-bold'>{pincode && pincode}</div>
                </div>
              </div>
            </div>}

            <div className='col-lg-4 col-md-4 col-sm-6 col-12 mt-3'>
              <div className='d-flex'>
                <DateRangeIcon className='me-2 text-primary' />
                <div>
                  <Typography>Created At</Typography>
                  <div className='fw-bold'>{selectedOrder.createdAt ? moment(selectedOrder.createdAt).format("lll") : "-"}</div>
                </div>
              </div>
            </div>
            </div>

            <div className='col-lg-12 col-md-12 col-sm-12 col-12 mt-3'>
              <div className='d-flex'>
                <ProductionQuantityLimitsIcon className='me-2 text-primary' />
                <div>
                  <Typography>Products</Typography>
                  <div className='fw-bold'>
                    {selectedOrder.products.map((item: any) => {
                      return (
                        <Chip label={item._id.product_name + " ("+ item.quantity+")"} className='me-2 border border-2' />
                      )
                    })}
                </div>
              </div>
            </div>

          </div>

        </DialogContent>
      </Dialog>
    )
  }

  const columnData: any = orderList.map((item: any) => {
    const order_user = item.shippingAddress?.firstName ?? "";

    return {
      user_name: order_user ? order_user : "-",
      amount: item.amount ? item.amount : "-",
      status: item.status ? item.status : "-",
      created_at: item.createdAt ? moment(item.createdAt).format("ll") : "-",
      action: <IconButton onClick={() => orderDetailView(item)}><RemoveRedEyeIcon className='text-primary' /></IconButton>
    }
  })

  const options: any = {
    responsive: "scroll",
    filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRowsHideCheckboxes: false,
    selectableRows: "none",
    print: false,
    dowload: false
  };

  return (// render()
    <div>
      <Loader open={alertData.showLoader} />
      <MySnackbar open={openSnackbar} type={openSnackbarType} variant={"filled"} message={openSnackbarMsg} duration={3000} handleClose={() => setAlertData((pre) => ({ ...pre, openSnackbar: false }))} />

      <div className='jr-card d-flex justify-content-between align-items-center'>
        <h4 className='bold'>Orders</h4>
      </div>

      <div className='col-12 col-md-12 col-sm-12'>
        <div className=' my-3'>
          <MUIDataTable
            data={columnData}
            columns={header}
            options={options}
          />
        </div>
      </div>

      {openViewDialog && openViewDialogBuild()}
    </div>
  )
}

export default Index