import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getFeedPosts } from "../store/postSlice/postThunk";
import Post from "../components/post/Post";
import Friends from "../components/Friends";
import { getFollowing } from "../store/followSlice/followersThunk";
import { loadUserFromToken } from "../store/profileSlice/profileThunk";
import { IoMdNotificationsOutline } from "react-icons/io";
import { NavLink } from "react-router-dom";

const HomePage = () => {
    const dispatch = useAppDispatch();
    const { following } = useAppSelector(state => state.followers);
    const { user } = useAppSelector(state => state.auth);
    const { unreadCount } = useAppSelector(state => state.notifications);
    const { feedPosts, feedLoading, noMoreFeedPosts } = useAppSelector(state => state.posts);
    const requestId = user?.id || user?._id;
    let skip = 0;
    const limit = 10;

    useEffect(() => {
        dispatch(loadUserFromToken());
        dispatch(getFeedPosts({ skip: 0, limit }));
        if (requestId) {
            dispatch(getFollowing(requestId));
        }
    }, [dispatch]);

    const loadMore = () => {
        if (noMoreFeedPosts) return;
        skip += limit;
        dispatch(getFeedPosts({ skip, limit }));
    };

    return (
        <section>
            <div className="flex items-center justify-between px-3 py-2 text-[24px] fixed top-0 z-20 w-full border-b-2 border-secondary bg-main">
                <h1 className="text-center font-bold">INJOY</h1>
                <NavLink to='/notifications' className="relative">
                    <IoMdNotificationsOutline />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-btn text-xs rounded-full px-1">
                            {unreadCount}
                        </span>
                    )}
                </NavLink>
            </div>

            <div className="pt-17">
                {following?.length > 0 && (
                    <Friends following={following} />
                )}

                {feedPosts.map((post, index) => (
                    post.user && (
                        <div key={`${post._id}-${index}`} className="px-5">
                            <Post
                                id={post._id}
                                user={post.user}
                                userId={post.user._id}
                                image={post.image}
                                text={post.text}
                                likes={post.likes.map(String)}
                                comments={post.commentsCount}
                            />
                        </div>
                    )
                ))}
            </div>

            {feedLoading && <p className="text-center py-2 text-[14px] text-graytext">Loading...</p>}
            {!feedLoading && !noMoreFeedPosts && (
                <button
                    onClick={loadMore}
                    className="w-full py-2 text-center text-[14px] cursor-pointer text-graytext"
                >
                    Load More
                </button>
            )}

            {!feedLoading && noMoreFeedPosts && (
                <p className="text-center py-2 text-[14px] text-graytext">No more posts</p>
            )}
        </section>
    );
};

export default HomePage;