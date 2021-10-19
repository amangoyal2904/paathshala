/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Divider, IconButton } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { Link } from 'react-router-dom'
import SideDrawer from './SideDrawer'
import Button from '../../../../Components/Controls/Button'
import './attendance.css'

function Attendance() {
  const [sideBar, setSideBar] = useState(true)

  const showSideBar = () => setSideBar(!sideBar)

  return (
    <div>
      <nav className={sideBar ? 'nav-menu active' : 'nav-menu'}>
        <ul className="nav-menu-items">
          <Divider style={{ backgroundColor: '#c7c1c1' }} />

          <li className="nav-bar-toggle">
            <Link to="">
              <div style={{ flexDirection: 'row' }}>
                <ArrowBackIosIcon />
                <span>Back to Dashboard</span>
              </div>
            </Link>
          </li>
          <Divider style={{ backgroundColor: '#c7c1c1' }} />
          {SideDrawer.map((item, index) => (
            <li key={index} className={item.cName}>
              <Link to={item.path}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
          <div>
            <Divider style={{ backgroundColor: '#c7c1c1' }} />
          </div>
          <div
            style={{
              marginTop: '90%',
              padding: '5%',
              paddingBottom: '100%',
              backgroundColor: '#868ae3',
            }}
          >
            <span>Batch Code</span>
            <div>
              <span>12345</span>
              <IconButton style={{ marginLeft: '2%' }}>
                <FileCopyIcon />
              </IconButton>
            </div>
          </div>
        </ul>
      </nav>
    </div>
  )
}

export default Attendance
