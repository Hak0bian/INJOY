import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getSavedPosts } from "../../store/SavedSlice/savedThunk";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

const SavedPostsPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { savedItems, posts, loading, error } = useAppSelector(state => state.saved);

    useEffect(() => {
        if (savedItems.length > 0) {
            dispatch(getSavedPosts(savedItems));
        }
    }, [savedItems, dispatch]);

    if (loading) return <p className="text-center pt-10">Loading...</p>;
    if (error) return <p className="text-center pt-10 text-red-500">{error}</p>;
    if (posts.length === 0) return <p className="text-center pt-10">No saved posts yet.</p>;

    return (
        <div>
            <div className="flex items-center gap-4 fixed top-0 z-10 bg-main w-full px-5 py-2 border-b border-secondary">
                <button onClick={() => navigate(-1)} className="cursor-pointer">
                    <FaArrowLeft />
                </button>
                <h2 className="text-[18px]">Saved Posts</h2>
            </div>

            <div className="pt-15 px-5 grid grid-cols-3 gap-1">
                {posts
                    .filter(p => p.post && p.user)
                    .map(({ post }) => (
                        <div
                            key={post._id}
                            className="aspect-square w-full overflow-hidden cursor-pointer"
                            onClick={() =>
                                navigate(`/saved-posts/${post._id}`, { state: { userId: post.user._id } })
                            }
                        >
                            <img
                                src={`http://localhost:5000/${post.image}`}
                                alt="Saved post"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default SavedPostsPage;
