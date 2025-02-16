import { Typography } from '@mui/material'
import React from 'react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import "./overview.scss"


const OrdersGraphCom = React.lazy(()=> import("./OrdersGraph"))
function Index() {
  return (
    <div>
      <div className='row'>
        <div className='col-lg-3 col-md-6 col-sm-12'>
          <div className='jr-card totalSales-background'>
            <div className='d-flex align-items-center'>
              <TrendingUpIcon className='me-3 overview-icon ' />
              <div>
                <h5 className='fw-bold'>Total Sales</h5>
                <h6 className='fw-bold'>₹ 500</h6>
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
                <h6 className='fw-bold'>55</h6>
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
                <h6 className='fw-bold'>55</h6>
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
                <h6 className='fw-bold'>55</h6>
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
              <div className='jr-card my-3'>
                <h1>mui table</h1>
              </div>
            </div>

          </div>
        </div>


        <div className='col-lg-4 col-md-12 col-sm-12'>
          <div className='jr-card'>
            <h1>card</h1>
            <h1>card</h1>
            <h1>card</h1>
            <h1>card</h1>
          </div>
        </div>




      </div>


    </div>
  )
}

export default Index
