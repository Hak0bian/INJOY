import { Outlet, NavLink } from 'react-router-dom'
import BottomNavigation from './nav/BottomNavigation'
import MyProfileSm from './profile/MyProfileSm'
import { ConversationsPage } from '../pages/Index'
import { IoSearch } from "react-icons/io5";
import { MdOutlineLibraryAdd } from "react-icons/md";

const Layout = () => {

  return (
    <div className="min-h-screen grid  grid-cols-1  sm:grid-cols-[16rem_1fr]  lg:grid-cols-[16rem_1fr_16rem] grid-rows-[1fr]">
      <aside className="hidden sm:block border-r border-secondary">
        <MyProfileSm />
      </aside>
      
      <main className="pb-16 sm:pb-4 relative">
        <div className="sticky top-0 z-20 bg-main border-b border-secondary flex items-center justify-between px-4 py-2">
          <NavLink to="/">
            <h1 className="font-bold text-xl">INJOY</h1>
          </NavLink>

          <div className="flex items-center gap-4">
            <NavLink to="/search" className="hidden sm:block">
              <IoSearch size={20} />
            </NavLink>

            <NavLink to="/add-post" className="hidden sm:block">
              <MdOutlineLibraryAdd size={20} />
            </NavLink>
          </div>
        </div>

        <Outlet />
      </main>

      <aside className="hidden lg:block border-l border-secondary">
        <ConversationsPage />
      </aside>

      <div className="sm:hidden fixed bottom-0 left-0 w-full z-30">
        <BottomNavigation />
      </div>
    </div>
  )
}

export default Layout