
import React, { useEffect, useState } from 'react'
import SideBarList from './SidebarList'
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function SideBar() {
  const [state, setState] = useState({
    check: false,
    viewMore: false,
    childCheck: false,
    selectedItem: {},
    sideBarData: SideBarList,
    childSelected: {}

  })

  const { sideBarData, check, selectedItem, viewMore, childCheck, childSelected } = state;
  const navigate = useNavigate()

  useEffect(() => {
    SideBarList.map((item) => {

    })
  }, [])
  const selecSidemenu = (item, childRoute) => {

    // if (childRoute) {
    //   let path = item.path
    //   if (path) {
    //     navigate(path)
    //   }
    //   setState((pre) => ({
    //     ...pre,
    //     childCheck: true,
    //     selectedItem: item
    //   }))
    // } else {

    let path = item.path
    if (path) {
      navigate(path)
    }
    setState((pre) => ({
      ...pre,
      check: true,
      selectedItem: item
    }))
    // }


  }

  const moreBtnClick = (item) => {
    console.log(item);
    if(item && item.moreOptions === true){
      item.moreOptions = !item.moreOptions 
      setState((pre) => ({
        ...pre,
        sideBarData: sideBarData
      }))
    }else if(item && item.moreOptions === false){
      item.moreOptions = !item.moreOptions 
      setState((pre) => ({
        ...pre,
        sideBarData: sideBarData
      }))
    }
  
  }

  const whenLeaveMouse = () => {
    setState((pre) => ({
      ...pre,
      // viewMore: true,
    }))
  }

  const childRouteNavigate = (data) => {
    setState((pre)=>({
      ...pre,
      childSelected:data
    }))
    navigate(data.path)
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
                { item.moreOptions && item.moreOptions===true ?
                  <div>
                    {item.others.map((data) => {
                      return (
                        <div>
                          {childSelected.name === data.name ?
                           <div style={{ fontSize: 15, marginLeft: 25,}} onClick={() => childRouteNavigate(data)} className={`${childCheck ? 'child-route-selected' : ""} d-flex iconDiv cursor-pointer ml-1 texr-orange`}>
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
    </div>
  )
}

export default SideBar