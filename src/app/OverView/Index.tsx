import { Chip } from '@mui/material'
import React, { ReactNode, Suspense, useEffect, useState } from 'react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import MUIDataTable from "mui-datatables";
import moment from "moment"
import "./overview.scss"
import HttpRequest from '../../Utilities/ApiCall/HttpRequest';
import Loader from '../../Utilities/Loader/Loader';
import MySnackbar from '../../AlertShow/Alert';


const OrdersGraphCom = React.lazy(() => import("./OrdersGraph"));
const ComparisonGraph = React.lazy(() => import("./ComparisonGraph"));

interface AlertData {
  showLoader: boolean;
  openSnackbar: boolean;
  openSnackbarType: string;
  openSnackbarMsg: string;
}
interface CardDeatails {
  total_orders: number;
  pending_orders: number;
  total_sales: number;
  paid_orders: number;
}

function Index() {
  const [cartDetails, setCardDetails] = useState<CardDeatails>({
    total_orders: 0,
    pending_orders: 0,
    paid_orders: 0,
    total_sales: 0
  });
  const [graphDates, setGraphDates] = useState<any>([])
  const [graphSeries, setGraphSeries] = useState<any>([])
  const [recentList, setRecentList] = useState([])
  const [alertData, setAlertData] = useState<AlertData>({
    showLoader: false,
    openSnackbar: false,
    openSnackbarType: '',
    openSnackbarMsg: ''
  });

  const columns = [
    {
      name: "user_name",
      label: "User Name",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "amount",
      label: "Amount (₹)",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "created_at",
      label: "Created At",
      options: {
        filter: true,
        sort: false,
      }
    }
  ];

  useEffect(() => {
    detailsApiCall()
    getRecentOrders()
  }, [])

  const getRecentOrders = async (): Promise<void> => {
    const method: string = "POST";
    const url: string = "overview/get-recent/orders";
    const data: any = {
      "from_date": moment().subtract(120, "days").format("YYYY-MM-DD"),
      "to_date": moment().format("YYYY-MM-DD"),
    }
    try {
      const response = await HttpRequest({ method, url, data });
      setAlertData((pre) => ({ ...pre, showLoader: false }));
      setRecentList(response.response_data ?? [])
      salesGraphDataFrame(response.response_data ?? [])
    } catch (error) {
      setAlertData((pre) => ({
        ...pre,
        showLoader: false,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message || "Something went wrong",
      }));
    }
  }
  const detailsApiCall = async (): Promise<void> => {
    const method: string = "GET";
    const url: string = "overview/get-details";
    setAlertData((pre) => ({ ...pre, showLoader: true }));
    try {
      const response = await HttpRequest({ method, url, data: {} });
      setAlertData((pre) => ({ ...pre, showLoader: false }));
      setCardDetails(response.response_data ?? {})
    } catch (error) {
      setAlertData((pre) => ({
        ...pre,
        showLoader: false,
        openSnakbar: true,
        openSnakbarType: "error",
        openSnakbarMsg: error.response_message || "Something went wrong",
      }));
    }
  }

  const salesGraphDataFrame = (overall: any): void => {
    const groupData = groupByFun(overall);

    const dates = Object.keys(groupData).map((date) => moment(date).format("ll"))
    const arr = Object.values(groupData).map((item: any) => {
      return {
        name: "Sales (INR)",
        data: [item.reduce((pre, acc) => pre + (acc.amount || 0), 0)]
      }
    })
    setGraphDates(dates)
    setGraphSeries(arr)
  }

  const groupByFun = (data: any): any => {
    let arr = {};
    data.forEach((item: any) => {
      item.createdAt = moment(item.createdAt).format("YYYY-MM-DD")
      if (arr[item.createdAt]) {
        arr[item.createdAt].push(item)
      } else {
        arr[item.createdAt] = []
        arr[item.createdAt].push(item)
      }
    })

    return arr;
  }
  const columnData: any = recentList.map((item: any) => {
    let statusVal: null | ReactNode = null
    if (item.status === "Paid") {
      statusVal = <Chip size='small' label="Paid" variant='outlined' className='border bg-success text-white px-2' />
    } else {
      statusVal = <Chip size='small' label="Pending" variant='outlined' className='border bg-danger text-white px-2' />

    }
    return {
      user_name: item.user && item.user.name ? item.user.name : "-",
      amount: item.amount ? item.amount : "-",
      status: item.status ? statusVal : "-",
      created_at: item.createdAt ? moment(item.createdAt).format("ll") : "-"
    }
  })

  const options = {
    filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRowsHideCheckboxes: false,
    selectableRows: "none",
    print: false,
    dowload: false
  };

  const compare_series = [cartDetails.paid_orders, cartDetails.pending_orders]
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
      <div className='row'>
        <div className='col-lg-4 col-md-6 col-sm-12'>
          <div className='jr-card totalSales-background'>
            <div className='d-flex align-items-center'>
              <TrendingUpIcon className='me-3 overview-icon ' />
              <div>
                <h5 className='fw-bold'>Total Sales</h5>
                <h6 className='fw-bold'>₹ {cartDetails.total_sales}</h6>
              </div>

            </div>
          </div>
        </div>
        <div className='col-lg-4 col-md-6 col-sm-12'>
          <div className='jr-card total-orders-background'>
            <div className='d-flex align-items-center'>
              <SignalCellularAltIcon className='me-3 overview-icon ' />
              <div>
                <h5 className='fw-bold'>Total Orders</h5>
                <h6 className='fw-bold'>{cartDetails.total_orders ? cartDetails.total_orders : "-"}</h6>
              </div>
            </div>
          </div>
        </div>

        <div className='col-lg-4 col-md-6 col-sm-12'>
          <div className='jr-card pending-orders-background'>
            <div className='d-flex align-items-center'>
              <PendingActionsIcon className='me-3 overview-icon ' />
              <div>
                <h5 className='fw-bold'>Pending Orders</h5>
                <h6 className='fw-bold'>{cartDetails.pending_orders ? cartDetails.pending_orders : "-"}</h6>
              </div>
            </div>
          </div>
        </div>

        <div className='col-lg-8 col-md-12 col-sm-12'>
          <div className='row'>
            <div className='col-12 col-md-12 col-sm-12'>
              <div className='jr-card my-3'>
                <OrdersGraphCom graphDates={graphDates} graphSeries={graphSeries} />
              </div>
            </div>
            <div className='col-12 col-md-12 col-sm-12'>
              <div className=' my-3'>
                <MUIDataTable
                  title={"Recent Orders"}
                  data={columnData}
                  columns={columns}
                  options={options}
                />
              </div>
            </div>

          </div>
        </div>


        <div className='col-lg-4 col-md-12 col-sm-12'>
          <div className='jr-card d-flex justify-content-center'>
            <Suspense fallback={<h1> </h1>}>
              <ComparisonGraph propData={compare_series} />
            </Suspense>
          </div>
        </div>




      </div>


    </div>
  )
}

export default Index
