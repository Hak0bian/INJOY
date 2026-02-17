import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getNotifications, markAllAsRead } from "../store/notificationsSlice/notificationsThunk";
import { formatDistanceToNow, format, differenceInHours } from "date-fns";
import { FaArrowLeft } from "react-icons/fa6";
import profile from "../assets/images/profile.jpg";

const NotificationsPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { items, loading } = useAppSelector((state) => state.notifications);

    useEffect(() => {
        dispatch(getNotifications());

        return () => {
            dispatch(markAllAsRead());
        };
    }, [dispatch]);

    return (
        <div className="pt-12">
            <div className="flex items-center gap-4 fixed top-0 z-10 bg-main w-full px-5 py-2 border-b border-secondary">
                <button onClick={() => navigate(-1)} className="cursor-pointer">
                    <FaArrowLeft />
                </button>
                <h3>Notifications</h3>
            </div>

            {loading && (
                <p className="text-graytext text-center text-sm pt-5">Loading...</p>
            )}

            {!loading && items.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
                    <p className="text-lg font-semibold mb-2">No notifications yet</p>
                    <p className="text-sm text-center">
                        When someone likes or comments on your posts,
                        you'll see it here.
                    </p>
                </div>
            )}

            {!loading && items.length > 0 && items.map((n) => (
                <div key={n._id} className={`flex items-center justify-between mx-2 my-1 p-2 border border-secondary rounded-xl ${!n.isRead ? "bg-gray-800" : ""}`}>
                    <div className="flex items-center gap-2 ">
                        <img
                            src={n?.sender?.profile?.photo ? `http://localhost:5000/${n.sender.profile.photo.replace("\\", "/")}` : profile}
                            className="w-9 h-9 rounded-full object-cover cursor-pointer"
                            onClick={() => navigate(`/user/${n?.sender?._id}`)}
                        />

                        <div
                            className={`cursor-pointer transition`}
                            onClick={() => navigate(`/user/${n?.recipient}/posts/${n.post._id}`)}
                        >
                            <div>
                                {n.type === "like" && (
                                    <p className="text-sm">
                                        <b className="mr-1">{n?.sender?.profile?.username || n?.sender?.fullname}</b>{" "}
                                        liked your post
                                    </p>
                                )}

                                {n.type === "comment" && (
                                    <p className="text-sm">
                                        <b className="mr-1">{n?.sender?.profile?.username || n?.sender?.fullname}</b>{" "}
                                        commented on your post
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-graytext">
                            {(() => {
                                const msgDate = new Date(n?.createdAt);
                                const hoursDiff = differenceInHours(new Date(), msgDate);
                                if (hoursDiff < 24) {
                                    return format(msgDate, "HH:mm");
                                } else {
                                    return `${formatDistanceToNow(msgDate)} ago`;
                                }
                            })()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationsPage;