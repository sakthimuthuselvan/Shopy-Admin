
import React, { useState } from 'react'
import SideBarList from './SidebarList'
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function SideBar() {
  const [state, setState] = useState({
    check: false,
    viewMore: false,
    childCheck: false,
    selectedItem: {},
    sideBarData: SideBarList,
    childSelected: {},
    openConfirmation: false
  })

  const { sideBarData, check, selectedItem, viewMore, childCheck, childSelected, openConfirmation } = state;
  const navigate = useNavigate()


  const selecSidemenu = (item, childRoute) => {
    if (item.name === "Logout") {
      setState((pre) => ({
        ...pre,
        openConfirmation: true,
      }))
    } else {
      let path = item.path
      if (path) {
        navigate(path)
      }
      setState((pre) => ({
        ...pre,
        check: true,
        selectedItem: item
      }))
    }
  }

  const moreBtnClick = (item) => {
    if (item && item.moreOptions === true) {
      item.moreOptions = !item.moreOptions
      setState((pre) => ({
        ...pre,
        sideBarData: sideBarData
      }))
    } else if (item && item.moreOptions === false) {
      item.moreOptions = !item.moreOptions
      setState((pre) => ({
        ...pre,
        sideBarData: sideBarData
      }))
    }

  }

  const childRouteNavigate = (data) => {
    setState((pre) => ({
      ...pre,
      childSelected: data
    }))
    navigate(data.path)
  }

  const openConfirmationBuild = () => {
    return (
      <Dialog
        open={openConfirmation}
        fullWidth
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleLogoutCancelFun()}>
            No, Cancel
          </Button>
          <Button className='text-danger' onClick={handleLogoutFun}>Yes, Logout</Button>
        </DialogActions>
      </Dialog>
    )
  }

  const handleLogoutFun = () => {
    localStorage.removeItem('_Auth');
    navigate("/")
    window.location.reload(); // ✅ reloads the current page
  };

  const handleLogoutCancelFun = () => {
    setState((pre) => ({
      ...pre,
      openConfirmation: false
    }))
  }
  return (
    <div>
      {
        sideBarData.map((item) => {
          if (item.name === selectedItem.name) {
            return (
              <div>
                <div onClick={() => selecSidemenu(item)} className={`${check ? 'selected' : ""} d-flex iconDiv cursor-pointer ml-1`}>
                  {item.icon}
                  <div onClick={() => moreBtnClick(item)} className='show fw-bold text-white ms-2'>{item.name} {item.moreOptions === true ? <KeyboardArrowUpIcon /> : item.moreOptions === false ? <KeyboardArrowDownIcon /> : null}</div>
                </div>
                {item.moreOptions && item.moreOptions === true ?
                  <div>
                    {item.others.map((data) => {
                      return (
                        <div>
                          {childSelected.name === data.name ?
                            <div style={{ fontSize: 15, marginLeft: 25, }} onClick={() => childRouteNavigate(data)} className={`${childCheck ? 'child-route-selected' : ""} d-flex iconDiv cursor-pointer ml-1 texr-orange`}>
                              {data.icon}
                              <div className=' show fw-bold ms-2'>{data.name}</div>
                            </div>
                            :
                            <div style={{ fontSize: 15, marginLeft: 25 }} onClick={() => childRouteNavigate(data)} className={`${childCheck ? 'child-route-selected' : ""} d-flex iconDiv cursor-pointer ml-1`}>
                              {data.icon}
                              <div className='text-white show fw-bold ms-2'>{data.name}</div>
                            </div>
                          }

                        </div>
                      )
                    })}
                  </div> : null}
              </div>
            )
          } else {
            return (
              <div onClick={() => selecSidemenu(item)} className={`d-flex iconDiv cursor-pointer ml-1`}>
                {item.icon}
                <div className='show fw-bold text-white ms-2'>{item.name}  {item.moreOptions ? <span onClick={() => moreBtnClick()}>{viewMore ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</span> : null}</div>
              </div>
            )
          }

        })
      }

      {openConfirmation === true && openConfirmationBuild()}
    </div>
  )
}

export default SideBar