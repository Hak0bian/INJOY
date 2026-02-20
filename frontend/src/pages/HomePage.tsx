import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getFeedPosts } from "../store/postSlice/postThunk";
import Post from "../components/post/Post";
import Friends from "../components/Friends";
import { getFollowing } from "../store/followSlice/followersThunk";
import { useEffect, useRef } from "react";


const HomePage = () => {
    const dispatch = useAppDispatch();
    const { following } = useAppSelector(state => state.followers);
    const { user } = useAppSelector(state => state.auth);
    const { feedPosts, feedLoading, noMoreFeedPosts } = useAppSelector(state => state.posts);

    const skipRef = useRef(0);
    const limit = 10;

    useEffect(() => {
        dispatch(getFeedPosts({ skip: 0, limit }));

        const requestId = user?.id || user?._id;
        if (requestId) {
            dispatch(getFollowing(requestId));
        }
    }, [dispatch, user?.id, user?._id]);

    const loadMore = () => {
        if (noMoreFeedPosts || feedLoading) return;
        skipRef.current += limit;
        dispatch(getFeedPosts({ skip: skipRef.current, limit }));
    };
    

    return (
        <section>
            <div className="pt-3">
                {following?.length > 0 && (
                    <Friends following={following} />
                )}

                <div className="grid xs:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xs:px-3">
                    {feedPosts.map((post, index) => (
                        post.user && (
                            <div key={`${post._id}-${index}`} className="px-3 xs:px-0">
                                <Post
                                    id={post._id}
                                    user={post.user}
                                    userId={post.user._id}
                                    image={post.image}
                                    text={post.text}
                                    likes={post.likes.map(String)}
                                    comments={post.commentsCount}
                                    createdAt={post.createdAt}
                                />
                            </div>
                        )
                    ))}
                </div>
            </div>

            {feedLoading && <p className="text-center py-2 text-[14px] text-graytext">Loading...</p>}
            {!feedLoading && !noMoreFeedPosts && feedPosts.length >= limit && (
                <button
                    onClick={loadMore}
                    className="w-full py-2 text-center text-[14px] cursor-pointer text-graytext"
                >
                    Load More
                </button>
            )}

            {!feedLoading && noMoreFeedPosts && feedPosts.length > 0 && (
                <p className="text-center py-2 text-[14px] text-graytext">No more posts</p>
            )}
        </section>
    );
};

export default HomePage;