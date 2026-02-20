import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { IoSettingsOutline } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { getUserPosts } from '../../store/postSlice/postThunk';
import { useNavigate } from "react-router-dom";
import Settings from './Settings';
import profile from '../../assets/images/profile.jpg'
import { getFollowCounts } from '../../store/followSlice/followersThunk';


const MyProfile = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const { user, initialized } = useAppSelector(state => state.auth);
    const { posts, getUserPostsLoading } = useAppSelector((state) => state.posts);
    const [openSettings, setOpenSettings] = useState(false)
    const { followersCount, followingCount } = useAppSelector(state => state.followers);
    const userId = user?.id || user?._id;

    useEffect(() => {
        if (!initialized) return;
        const userId = user?.id || user?._id;

        if (!userId) return;
        dispatch(getUserPosts(userId));
    }, [initialized, user?.id, user?._id, dispatch]);

    useEffect(() => {
        if (!initialized) return;

        const userId = user?.id || user?._id;
        if (!userId) return;

        dispatch(getUserPosts(userId));
        dispatch(getFollowCounts(userId));
    }, [initialized, user?.id, user?._id, dispatch]);


    return (
        <div className='pt-5 pb-30 px-3'>
            <div className='text-right sm:hidden'>
                <button onClick={() => setOpenSettings(true)} className='cursor-pointer'>
                    <IoSettingsOutline className='w-5 h-5' />
                </button>
            </div>

            <div className='flex flex-col gap-2 pt-6 mdx:text-center'>
                {user?.profile?.username && <p className='text-center text-sm'>@{user.profile.username}</p>}
                <img
                    src={user?.profile?.photo ? `http://localhost:5000/${user?.profile?.photo.replace("\\", "/")}` : profile}
                    alt="profile image"
                    className='w-24 h-24 rounded-full self-center object-cover'
                />
                <h3 className='font-semibold'>{user?.fullname || ""}</h3>
                <p className='text-[12px]'>{user?.profile?.bio || ""}</p>
            </div>
            <div className='flex justify-center pt-5 pb-8'>
                <div className='px-5 border-r border-graytext text-center text-[14px]'>
                    <p>{posts.length}</p>
                    <p>Posts</p>
                </div>
                <NavLink to={`/user/${userId}/followers`} className='hover:text-btn duration-300'>
                    <div className='px-5 border-r border-graytext text-center text-[14px]'>
                        <p>{followersCount}</p>
                        <p>Followers</p>
                    </div>
                </NavLink>
                <NavLink to={`/user/${userId}/following`} className='hover:text-btn duration-300'>
                    <div className='px-5 text-center text-[14px]'>
                        <p>{followingCount}</p>
                        <p>Following</p>
                    </div>
                </NavLink>
            </div>

            {/* Posts */}
            <div>
                {getUserPostsLoading && <p className='text-sm text-graytext text-center'>Loading...</p>}
                {!getUserPostsLoading && posts.length === 0 ? (
                    <p className="text-center text-graytext border-t border-graytext pt-5">No posts yet</p>
                ) : (
                    <div className="grid grid-cols-3 gap-1 mdx:grid-cols-4">
                        {posts.map((post) => (
                            <div key={post._id} className="aspect-4/5 w-full overflow-hidden">
                                {post.image && (
                                    <img
                                        src={`http://localhost:5000/${post.image}`}
                                        className="w-full h-full object-cover cursor-pointer"
                                        onClick={() => {
                                            if (userId) {
                                                navigate(`/user/${userId}/posts/${post._id}`, {
                                                    state: { userId }
                                                })
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Settings open={openSettings} onClose={() => setOpenSettings(false)} />
        </div>
    )
}

export default MyProfile