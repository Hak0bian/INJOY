import { Outlet } from 'react-router-dom'
import BottomNavigation from './nav/BottomNavigation'

const Layout = () => {
  return (
    <>
      <BottomNavigation />
      <Outlet />
    </>
  )
}

export default Layout