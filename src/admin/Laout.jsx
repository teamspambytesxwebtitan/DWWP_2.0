import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

function Laout() {
  return (
    <>
    {/* thsi is layout  */}
    <Sidebar/>
    <Outlet/>
    </>
  )
}

export default Laout