import { NavLink } from "react-router-dom"
import profile from '../assets/images/profile.jpg'

const Friends = () => {
  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-3">
        <NavLink to=''>
            <div className="text-[12px] w-12 overflow-hidden">
                <img src={profile} className="w-12 h-12 rounded-full" />
                <p>username</p>
            </div>
        </NavLink>

    </div>
  )
}

export default Friends