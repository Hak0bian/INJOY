import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import type { JSX } from "react";


const ProfileGuard = ({ children }: { children: JSX.Element }) => {
    const { user, initialized } = useAppSelector(state => state.auth);

    if (!initialized) return null;
    if (!user) return <Navigate to="/sign-in" />;
    if (!user.profileCompleted) return <Navigate to="/profile-setup" />;

    return children;
};

export default ProfileGuard;