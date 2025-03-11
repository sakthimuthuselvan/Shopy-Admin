import { Chip, Typography } from '@mui/material'
import React, { ReactNode, Suspense, useState } from 'react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import MUIDataTable from "mui-datatables";
import moment from "moment"
import "./overview.scss"


const OrdersGraphCom = React.lazy(() => import("./OrdersGraph"));
const ComparisonGraph = React.lazy(() => import("./ComparisonGraph"))

function Index() {
  const [cartDetails, setCardDetails] = useState({
    "total_sales": 500,
    "total_orders": 200,
    "pending_orders": 130,
    "new_customer": 30
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

  const data = [
    {
      "user_name":"Sakthi M",
      "_id": "67a77440710ab222b897e1a8",
      "orderId": "order_PtFTa6kNd6rnN7",
      "paymentId": "pay_PtFUFpmOUxBJU5",
      "signature": "4153e5afe95a2484b83e2bcf319c934e0b4256ebbb13a04f1ae6e92e3eabe8eb",
      "amount": 80,
      "currency": "INR",
      "status": "Paid",
      "createdAt": "2025-02-08T15:12:00.955Z",
      "__v": 0
    }
    ,
  ];

  const columnData: any = data.map((item)=>{
    let statusVal: null | ReactNode = null
    if(item.status === "Paid"){
      statusVal = <Chip size='small' label="Paid" variant='outlined' className='border bg-success text-white px-2' />
    }else{
      statusVal = <Chip size='small' label="Paid" variant='outlined' className='border bg-danger text-white px-2' />

    }
    return{
      user_name: item.user_name ? item.user_name : "-",
      amount:item.amount ? item.amount : "-",
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

  let completed = cartDetails.total_orders - cartDetails.pending_orders
  const compare_series = [cartDetails.pending_orders, completed ]
  return (
    <div>
      <div className='row'>
        <div className='col-lg-3 col-md-6 col-sm-12'>
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
        <div className='col-lg-3 col-md-6 col-sm-12'>
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

        <div className='col-lg-3 col-md-6 col-sm-12'>
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

        <div className='col-lg-3 col-md-6 col-sm-12'>
          <div className='jr-card new-customer-background'>
            <div className='d-flex align-items-center'>
              <PersonIcon className='me-3 overview-icon ' />
              <div>
                <h5 className='fw-bold'>New Customers</h5>
                <h6 className='fw-bold'>{cartDetails.new_customer ? cartDetails.new_customer : "-"}</h6>
              </div>
            </div>
          </div>
        </div>


        <div className='col-lg-8 col-md-12 col-sm-12'>
          <div className='row'>
            <div className='col-12 col-md-12 col-sm-12'>
              <div className='jr-card my-3'>
                <OrdersGraphCom />
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
