import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getFeedPosts } from "../store/postSlice/postThunk";
import Post from "../components/post/Post";
import Friends from "../components/Friends";
import { getFollowing } from "../store/followSlice/followersThunk";

const HomePage = () => {
    const dispatch = useAppDispatch();
    const { following } = useAppSelector(state => state.followers);
    const { user } = useAppSelector(state => state.auth);
    const requestId = user?.id || user?._id;
    const { feedPosts, feedLoading, noMoreFeedPosts } = useAppSelector(state => state.posts);
    let skip = 0;
    const limit = 10;

    useEffect(() => {
        dispatch(getFeedPosts({ skip: 0, limit }));
        if(requestId){
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
            <h1 className="text-[24px] text-center font-bold py-2 pl-5">INJOY</h1>
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