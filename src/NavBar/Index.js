import React, { useEffect, useState } from 'react'
import "./nav.css"
import MenuIcon from '@mui/icons-material/Menu';
import WindowWidth from '../Utilities';
import { useSelector, useDispatch } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import SideBarList from "../SideBar/SidebarList";

function Index() {
  const navigate = useNavigate()
  const [companyName] = useState("Shopy")
  const [state, setState] = useState({
    isClicked: false,
    sideBar: false,
    categoryClick: false,

    check: false,
    viewMore: false,
    childCheck: false,
    selectedItem: {},
    sideBarData: SideBarList,
    childSelected: {}

  })

  const [anchorEl, setAnchorEl] = React.useState(null);
  const { sideBar, categoryClick, check, viewMore, childCheck, sideBarData, childSelected, selectedItem } = state;



  const globalState = useSelector((state) => state);
  const dispatch = useDispatch()

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

  const handleClick = (event) => {
    navigate("/wish-list")
  };
  const handleClose = () => {
    setAnchorEl(null);
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

  const categoryClickFun = () => {
    setState((pre) => {
      return {
        ...pre,
        categoryClick: !categoryClick
      }
    })
  }

  const homeBtnClick = () => {
    navigate("/")

  }
  const listBtnClick = (item) => {
    navigate(item.path)
    setState((pre) => ({
      ...pre,
      isClicked: false
    }))
  }

  const selecSidemenu = (item, childRoute) => {

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

  const moreBtnClick = (item) => {
    console.log(item);
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
  return (
    <div className='nav'>
      <div className={`full-nav bg-primary letter-primary`}>
        <div className='nav-content mx-3'>
          <h1 className='text-white' onClick={() => homeBtnClick()}>{companyName}</h1>
          <div className='box3'>
            {size === "sm" ?
              <div>
                <div className='d-flex align-items-center'>
                  <IconButton onClick={sideBaropen}><MenuIcon sx={{ fontSize: 25 }} className='text-white pr-3' /></IconButton>
                  <h3 className='text-white pl-4 pt-2' onClick={() => homeBtnClick()}>{companyName}</h3>
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

                      <h6 className='item pointer'>Whish List</h6>
                      <h6 className='item pointer'>Logout</h6>
                    </div>
                  </div>
                </div>
              </div>
              : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index