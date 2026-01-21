import { Outlet } from 'react-router-dom'
import BottomNavigation from './nav/BottomNavigation'

const Layout = () => {
  return (
    <section>
        <BottomNavigation />
        <Outlet />
    </section>
  )
}

export default Layout