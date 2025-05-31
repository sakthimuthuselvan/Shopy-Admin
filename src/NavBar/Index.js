import React, { useEffect, useState } from 'react'
import "./nav.css"
import MenuIcon from '@mui/icons-material/Menu';
import WindowWidth from '../Utilities';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from '@mui/material';
import SideBarList from "../SideBar/SidebarList";

function Index() {
  const navigate = useNavigate()
  const [companyName] = useState("Shopy Admin")
  const [state, setState] = useState({
    isClicked: false,
    sideBar: false,
    categoryClick: false,

    check: false,
    viewMore: false,
    childCheck: false,
    selectedItem: {},
    sideBarData: SideBarList,
    childSelected: {},
    openConfirmation: false

  })

  const { sideBar, check, viewMore, childCheck, openConfirmation, sideBarData, childSelected, selectedItem } = state;

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
  }, [sideBar])


  const handleOutsideClick = (event) => {
    // Close sidebar if the clicked element is outside the sidebar
    if (!event.target.closest('.slide-layer')) {
      setState((pre) => {
        return {
          ...pre,
          sideBar: false
        }
      })
    }
  };

  const size = WindowWidth()

  const sideBaropen = () => {
    setState((pre) => {
      return {
        ...pre,
        sideBar: true,
        categoryClick: false
      }
    })
  }

  const sidebarClose = () => {
    setState((pre) => {
      return {
        ...pre,
        sideBar: false
      }
    })
  }

  const homeBtnClick = () => {
    navigate("/")
  }

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
        selectedItem: item,
        sideBar: item.moreOptions ? true : false
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
      childSelected: data,
      sideBar: false
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
    <div className='nav'>
      <div className={`full-nav bg-primary letter-primary`}>
        <div className='nav-content mx-3'>
          <div className='box3'>
            {size === "sm" ?
              <div>
                <div className='d-flex align-items-center'>
                  <IconButton onClick={sideBaropen}><MenuIcon sx={{ fontSize: 25 }} className='text-white pr-3' /></IconButton>
                  <Typography variant='h6' className='text-white pl-4' onClick={() => homeBtnClick()}>{companyName}</Typography>
                </div>
                <div className={`${sideBar ? "sakthi" : ""}`}>
                  <div className={`slide-layer bg-primary text-white ${sideBar ? "sidebar-open" : ""}`}>
                    <IconButton onClick={sidebarClose}><CloseIcon style={{ fontSize: "2rem" }} className='text-white' /></IconButton>
                    <div className='pl-2 pt-2'>
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
                                            <div style={{ fontSize: 13, marginLeft: 25, }} onClick={() => childRouteNavigate(data)} className={`${childCheck ? 'child-route-selected' : ""} d-flex iconDiv cursor-pointer ml-1 texr-orange`}>
                                              {data.icon}
                                              <div className=' show fw-bold ms-2'>{data.name}</div>
                                            </div>
                                            :
                                            <div style={{ fontSize: 13, marginLeft: 25 }} onClick={() => childRouteNavigate(data)} className={`${childCheck ? 'child-route-selected' : ""} d-flex iconDiv cursor-pointer ml-1`}>
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
                    </div>
                  </div>
                </div>
              </div>
              : null}
          </div>
        </div>
      </div>
      {openConfirmation === true && openConfirmationBuild()}

    </div>
  )
}

export default Index