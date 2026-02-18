import { useEffect } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import profile from '../../assets/images/profile.jpg';
import { getUserPosts } from '../../store/postSlice/postThunk';
import { followUser, getUserById } from '../../store/usersSlice/usersThunk';
import { setActiveConversation } from '../../store/messageSlice/messageSlice';
import { createConversation } from '../../store/messageSlice/messageThunks';


const UserProfile = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const { userId } = useParams<{ userId: string }>();
    const { otherUser } = useAppSelector(state => state.users);
    const { posts, getUserPostsLoading } = useAppSelector(state => state.posts);
    const { user: currentUser } = useAppSelector(state => state.auth);
    const isFollowing = otherUser?.isFollowing;

    useEffect(() => {
        if (userId) {
            dispatch(getUserById(userId));
            dispatch(getUserPosts(userId));
        }
        if (currentUser?._id === userId) {
            navigate('/my-profile')
        }
    }, [userId]);

    const handleFollow = () => {
        if (otherUser?._id) {
            dispatch(followUser(otherUser._id));
        }
    };

    const handleMessage = async () => {
        if (!userId) return;
        const conversation = await dispatch(createConversation(userId)).unwrap();
        dispatch(setActiveConversation(conversation._id));
        navigate(`/messages/${conversation._id}`);
    };


    return (
        <div className="pt-10 pb-30 px-3">
            <div className="flex flex-col gap-2">
                {otherUser?.profile?.username && <p className="mb-2 text-sm">@{otherUser.profile.username}</p>}
                <div className="flex">
                    <img
                        src={otherUser?.profile?.photo ? `http://localhost:5000/${otherUser.profile.photo.replace("\\", "/")}` : profile}
                        alt="profile"
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="pl-4 text-[14px] font-semibold">{otherUser?.fullname}</h3>
                        <div className="flex py-4">
                            <div className="px-4 border-r border-graytext text-[14px]">
                                <p>{posts.length}</p>
                                <p>Posts</p>
                            </div>
                            <NavLink to={`/user/${userId}/followers`} className='hover:text-btn duration-300'>
                                <div className="px-4 border-r border-graytext text-[14px]">
                                    <p>{otherUser?.followers?.length ?? 0}</p>
                                    <p>Followers</p>
                                </div>
                            </NavLink>
                            <NavLink to={`/user/${userId}/following`} className='hover:text-btn duration-300'>
                                <div className="px-4 text-[14px]">
                                    <p>{otherUser?.following?.length ?? 0}</p>
                                    <p>Following</p>
                                </div>
                            </NavLink>
                        </div>
                    </div>
                </div>
                <p className="text-[12px] pb-3">{otherUser?.profile?.bio}</p>

                {currentUser && otherUser && currentUser._id !== otherUser._id && (
                    <div className="flex justify-center gap-2 pt-2 pb-8">
                        <button
                            onClick={handleFollow}
                            className={`w-full h-10 rounded-full cursor-pointer ${isFollowing ? 'bg-secondary' : 'bg-btn'}`}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                        <button
                            onClick={handleMessage}
                            className="w-full h-10 bg-secondary rounded-full cursor-pointer"
                        >
                            Message
                        </button>
                    </div>
                )}
            </div>

            {/* Posts */}
            <div>
                {getUserPostsLoading && <p className='text-sm text-graytext text-center'>Loading...</p> }
                {!getUserPostsLoading && posts.length === 0 ? (
                    <p className="text-center text-graytext border-t border-graytext pt-5">No posts yet</p>
                ) : (
                    <div className="grid grid-cols-3 gap-1">
                        {posts.map(post => (
                            <div key={post._id} className="aspect-4/5 w-full overflow-hidden">
                                {post.image && (
                                    <img
                                        src={`http://localhost:5000/${post.image}`}
                                        className="w-full h-full object-cover cursor-pointer"
                                        onClick={() => {
                                            if (otherUser?._id) {
                                                navigate(`/user/${otherUser._id}/posts/${post._id}`, { state: { userId: otherUser._id } })
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;