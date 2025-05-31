import React, { useEffect, useState } from 'react'
import MySnackbar from '../../AlertShow/Alert'
import Loader from '../../Utilities/Loader/Loader';
import MUIDataTable from "mui-datatables";
import HttpRequest from '../../Utilities/ApiCall/HttpRequest';
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
            name: "email",
            label: "Email",
            options: {
                filter: false,
            }
        },
        {
            name: "phone",
            label: "Phone",
            options: {
                filter: false,
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
            name: "last_login",
            label: "Last Login",
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
        const url: string = "shopy/get/users";
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
            user_name: item.name ? item.name : "-",
            email: item.email ? item.email : "-",
            phone: item.phone ? item.phone : "-",
            created_at: item.createdAt ? moment(item.createdAt).format("ll") : "-",
            last_login: item.lastLogin ? moment(item.lastLogin).format("ll") : "-",
        }
    })

    const options: any = {
        responsive:"scroll",
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
                <h4 className='bold'>Customers</h4>
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