import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import type { JSX } from "react";


const ProfileSetupGuard = ({ children }: { children: JSX.Element }) => {
    const user = useAppSelector((state) => state.auth.user);

    if (!user) return <Navigate to="/sign-in" />;
    if (user.profileCompleted) return <Navigate to="/my-profile" />;

    return children;
};

export default ProfileSetupGuard;