import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getRecommendedPosts } from "../../store/postSlice/postThunk";
import { searchUsers } from "../../store/usersSlice/usersThunk";
import { IoCloseOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import profileImg from "../../assets/images/profile.jpg";

const SearchPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { recommendedPosts, recLoading } = useAppSelector(state => state.posts);
    const { searchResults, searchLoading } = useAppSelector(state => state.users);
    const [query, setQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const { onlineUsers } = useAppSelector((state) => state.users);

    useEffect(() => {
        if (!query.trim()) {
            setDropdownOpen(false);
            setHasSearched(false);
            return;
        }

        setDropdownOpen(true);
        setHasSearched(false);

        const timer = setTimeout(() => {
            dispatch(searchUsers(query));
            setHasSearched(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, [query, dispatch]);

    useEffect(() => {
        dispatch(getRecommendedPosts());
    }, [dispatch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const clearQuery = () => {
        setQuery("");
        setDropdownOpen(false);
    };

    const handlePostClick = (postId: string) => {
        navigate(`/search/rec-posts/${postId}`);
    };

    return (
        <div className="px-2 pt-15">
            <div className="relative">
                <div className="fixed top-0 left-0 right-0 z-40 bg-main py-3 px-2">
                    <div className="relative flex items-center gap-1">
                        <button onClick={() => navigate(-1)} className="cursor-pointer px-1">
                            <FaArrowLeft />
                        </button>
                        <input
                            value={query}
                            onChange={handleInputChange}
                            placeholder="Search users..."
                            className="w-full h-9 px-4 rounded-md bg-secondary outline-0"
                        />
                        {query && (
                            <button
                                onClick={clearQuery}
                                className="absolute right-2 text-graytext text-[20px]"
                                aria-label="Clear"
                            >
                                <IoCloseOutline />
                            </button>
                        )}
                    </div>

                    {dropdownOpen && (
                        <div className="absolute left-0 right-0 z-10 min-h-screen bg-main border-b-2 mt-3 px-3">
                            {searchLoading && (
                                <p className="pt-3 text-graytext text-center text-sm">Searching...</p>
                            )}
                            {!searchLoading && hasSearched && searchResults.length === 0 && (
                                <p className="text-graytext text-sm text-center pt-3">No users found</p>
                            )}

                            {!searchLoading &&
                                searchResults.map(user => (
                                    <NavLink
                                        key={user._id}
                                        to={`/user/${user._id}`}
                                        className="flex items-center gap-3 py-2 hover:bg-secondary cursor-pointer"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <div className="relative">
                                            <img
                                                className="w-8 h-8 rounded-full object-cover"
                                                src={
                                                    user.profile?.photo
                                                        ? `http://localhost:5000/${user.profile.photo}`
                                                        : profileImg
                                                }
                                            />
                                            {onlineUsers.includes(user?._id) && (
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-main" />
                                            )}
                                        </div>
                                        <span>{user.profile?.username || user.fullname}</span>
                                    </NavLink>
                                ))}
                        </div>
                    )}
                </div>
            </div>

            {!query.trim() && (
                <>
                    {recLoading && (
                        <p className="text-center text-graytext pt-3">Loading...</p>
                    )}

                    {!recLoading && recommendedPosts.length === 0 && (
                        <p className="text-center text-graytext pt-3">
                            No posts to show
                        </p>
                    )}

                    <div className="grid grid-cols-3 gap-1">
                        {recommendedPosts.map(post => (
                            <div
                                key={post._id}
                                className="aspect-4/5 w-full overflow-hidden cursor-pointer"
                                onClick={() => handlePostClick(post._id)}
                            >
                                {post.image && (
                                    <img
                                        src={`http://localhost:5000/${post.image.replace("\\", "/")}`}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchPage;