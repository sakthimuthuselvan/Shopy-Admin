import React, { useEffect, useState } from 'react'
import MySnackbar from '../../AlertShow/Alert'
import Loader from '../../Utilities/Loader/Loader';
import MUIDataTable from "mui-datatables";
import HttpRequest from '../../Utilities/ApiCall/HttpRequest';
import { Chip } from '@mui/material';
import moment from 'moment';

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


  const columnData: any = orderList.map((item: any) => {
    return {
      user_name: item.user_id && item.user_id.name ? item.user_id.name : "-",
      amount: item.amount ? item.amount : "-",
      status: item.status ? item.status : "-",
      created_at: item.createdAt ? moment(item.createdAt).format("ll") : "-"
    }
  })

  const options: any = {
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
    </div>
  )
}

export default Index