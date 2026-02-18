import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getSavedPosts } from "../../store/SavedSlice/savedThunk";
import Post from "../../components/post/Post";
import { FaArrowLeft } from "react-icons/fa6";


const SavedPostDetailPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { postId } = useParams<{ postId: string }>();
    const { savedItems, posts, loading, error } = useAppSelector(state => state.saved);
    const postRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const hasScrolledRef = useRef(false);

    useEffect(() => {
        if (savedItems.length > 0 && posts.length === 0) {
            dispatch(getSavedPosts(savedItems));
        }
    }, [savedItems, posts.length, dispatch]);

    useEffect(() => {
        if (postId && postRefs.current[postId] && !hasScrolledRef.current) {
            hasScrolledRef.current = true;
            setTimeout(() => {
                postRefs.current[postId]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 0);
        }
    }, [postId, posts]);

    if (loading) return <p className="text-center pt-10">Loading...</p>;
    if (error) return <p className="text-center pt-10 text-red-500">{error}</p>;
    if (posts.length === 0) return <p className="text-center pt-10">No saved posts yet.</p>;

    return (
        <div className="min-h-screen py-5">
            <div className="flex items-center gap-4 fixed top-0 z-10 bg-main w-full px-5 py-2 border-b border-secondary">
                <button onClick={() => navigate(-1)} className="cursor-pointer">
                    <FaArrowLeft />
                </button>
                <h2 className="text-[18px]">Saved Posts</h2>
            </div>

            {posts
                .filter(p => p.post && p.user)
                .map(({ post, user }) => (
                    <div
                        key={post._id}
                        ref={(el) => { postRefs.current[post._id] = el }}
                        className="px-5 my-10"
                    >
                        <Post
                            id={post._id}
                            user={user}
                            userId={user._id}
                            image={post.image}
                            text={post.text}
                            likes={post.likes?.map(String) || []}
                            comments={post.commentsCount || 0}
                            createdAt={post.createdAt}
                        />
                    </div>
                ))}
        </div>
    );
};

export default SavedPostDetailPage;