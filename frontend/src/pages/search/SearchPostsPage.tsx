import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getRecommendedPosts } from "../../store/postSlice/postThunk";
import Post from "../../components/post/Post";
import { FaArrowLeft } from "react-icons/fa6";

const SearchPostsPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { postId } = useParams<{ postId: string }>();
    const { recommendedPosts, recLoading, recError } = useAppSelector(state => state.posts);
    const postRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const hasScrolledRef = useRef(false);

    useEffect(() => {
        if (recommendedPosts.length === 0) {
            dispatch(getRecommendedPosts());
        }
    }, [dispatch, recommendedPosts.length]);

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
    }, [postId, recommendedPosts]);

    if (recLoading) return <p className="text-center pt-10">Loading...</p>;
    if (recError) return <p className="text-center pt-10 text-red-500">{recError}</p>;
    if (recommendedPosts.length === 0) return <p className="text-center pt-10">No posts to show.</p>;

    return (
        <div className="min-h-screen">
            <div className="flex items-center gap-4 fixed top-0 z-10 bg-main w-full px-3 py-2 border-b border-secondary">
                <button onClick={() => navigate(-1)} className="cursor-pointer">
                    <FaArrowLeft />
                </button>
                <h2 className="text-[18px]">Recommended Posts</h2>
            </div>

            <div className="grid xs:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-3">
                {recommendedPosts
                    .filter(p => p.user)
                    .map(post => (
                        <div
                            key={post._id}
                            ref={(el) => { postRefs.current[post._id] = el }}
                        >
                            <Post
                                id={post._id}
                                user={post.user}
                                userId={post.user._id}
                                image={post.image}
                                text={post.text}
                                likes={post.likes?.map(String) || []}
                                comments={post.commentsCount || 0}
                                createdAt={post.createdAt}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default SearchPostsPage;