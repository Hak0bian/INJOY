import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getUserPosts } from "../../store/postSlice/postThunk";
import { FaArrowLeft } from "react-icons/fa6";
import Post from "../../components/post/Post";


const UserPostsPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const location = useLocation();
    const { postId } = useParams<{ postId: string }>();
    const { user } = useAppSelector((state) => state.auth);
    const { posts } = useAppSelector((state) => state.posts);
    const postRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const userId = location.state?.userId;

    useEffect(() => {
        if (userId) {
            dispatch(getUserPosts(userId));
        }
    }, [user, dispatch]);

    useEffect(() => {
        if (postId && postRefs.current[postId]) {
            setTimeout(() => {
                postRefs.current[postId]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 0);
        }
    }, [postId, posts]);


    return (
        <div className="min-h-screen px-5 py-5 space-y-5">
            <div className="flex items-center gap-4 fixed top-0 z-10 bg-main w-full py-2">
                <button onClick={() => navigate(-1)} className="cursor-pointer">
                    <FaArrowLeft />
                </button>
                <h2 className="text-[20px]">Posts</h2>
            </div>

            {posts.map((post) => (
                <div
                    key={post._id}
                    ref={(el) => { postRefs.current[post._id] = el ?? null }}
                >
                    <Post
                        id={post._id}
                        user={post.user}
                        userId={post.user._id}
                        image={post.image}
                        text={post.text}
                        likes={post.likes.length}
                        comments={post.comments.length}
                    />
                </div>
            ))}
        </div>
    );
};

export default UserPostsPage