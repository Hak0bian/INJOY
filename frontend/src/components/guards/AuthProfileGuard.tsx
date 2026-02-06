import { Navigate, useLocation, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import type { JSX } from "react";

interface Props {
    children: JSX.Element;
    requireProfileCompleted?: boolean;
}

const AuthProfileGuard = ({ children, requireProfileCompleted = true }: Props) => {
    const { user, initialized } = useAppSelector(state => state.auth);
    const { userId } = useParams<{ userId: string }>();
    const location = useLocation();
    if (!initialized) return null;

    if (!user) {
        return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
    }

    if (requireProfileCompleted && !user.profileCompleted) {
        return <Navigate to="/profile-setup" replace />;
    }

    if (!requireProfileCompleted && user.profileCompleted) {
        return <Navigate to="/my-profile" replace />;
    }

    if (user?._id === userId) {
        <Navigate to="/my-profile" replace />
    }

    return children;
};

export default AuthProfileGuard;