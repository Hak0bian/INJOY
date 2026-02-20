import { NavLink } from "react-router-dom";
import profileImg from '../assets/images/profile.jpg';
import type { IUserPreview } from "../types";

const Friends = ({ following }: {following: IUserPreview[]}) => {
    if (!following || following.length === 0) return null;

    return (
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-3 px-3">
            {following.map(user => (
                <NavLink to={`/user/${user._id}`} key={user._id}>
                    <div className="text-[12px] w-12 overflow-hidden text-center">
                        <img
                            src={user.profile?.photo ? `http://localhost:5000/${user?.profile?.photo.replace("\\", "/")}` : profileImg}
                            className="w-12 h-12 rounded-full object-cover mx-auto border-2 border-btn"
                        />
                        <p className="truncate text-graytext">{user?.profile?.username || user?.fullname}</p>
                    </div>
                </NavLink>
            ))}
        </div>
    );
};

export default Friends;