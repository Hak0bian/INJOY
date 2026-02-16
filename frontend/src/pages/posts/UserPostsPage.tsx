import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getUserPosts } from "../../store/postSlice/postThunk";
import { FaArrowLeft } from "react-icons/fa6";
import Post from "../../components/post/Post";


const UserPostsPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const { posts } = useAppSelector((state) => state.posts);
    const postRefs = useRef<{[key: string]: HTMLDivElement | null }>({});
    const { postId, userId } = useParams<{postId: string; userId: string}>();
    const hasScrolledRef = useRef(false);

    useEffect(() => {
        if (!userId) return;
        dispatch(getUserPosts(userId));
    }, [userId, dispatch]);

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

    return (
        <div className="min-h-screen py-10">
            <div className="flex items-center gap-4 fixed top-0 z-10 bg-main w-full px-5 py-2 border-b border-secondary">
                <button onClick={() => navigate(-1)} className="cursor-pointer">
                    <FaArrowLeft />
                </button>
                <h2 className="text-[20px]">Posts</h2>
            </div>

            {posts.map((post) => (
                <div
                    key={post._id}
                    ref={(el) => { postRefs.current[post._id] = el ?? null }}
                    className="px-5"
                >
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
            ))}
        </div>
    );
};

export default UserPostsPage