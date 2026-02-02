import { useEffect } from "react";
import { useParams } from "react-router-dom";
import profile from "../assets/images/profile.jpg";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getFollowers, getFollowing } from "../store/followSlice/followersThunk";
import { followUser } from "../store/usersSlice/usersThunk";


const FollowersPage: React.FC<{ type: "followers" | "following" }> = ({ type }) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { followers, following, loading, error } = useAppSelector(state => state.followers);
  const { user: currentUser } = useAppSelector(state => state.auth);
  const idToFetch = id ?? currentUser?._id;

  const handleFollow = (id: string) => {
    if (id) {
      dispatch(followUser(id));
    }
  };

  useEffect(() => {
    if (!idToFetch) return;
    if (type === "followers") dispatch(getFollowers(idToFetch));
    else dispatch(getFollowing(idToFetch));
  }, [idToFetch, type, dispatch]);

  const users = type === "followers" ? followers : following;

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="px-5 py-5">
      <h3 className="text-center font-semibold">{type === "followers" ? "Followers" : "Following"}</h3>
      {users.map((f) => {
        const isFollowing = currentUser?.following?.includes(f._id);

        return (
          <div key={f._id} className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2 text-[14px]">
              <img
                src={f.profile?.photo ? `http://localhost:5000/${f.profile.photo.replace("\\", "/")}` : profile}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p>{f.profile?.username}</p>
                <p className="text-graytext">{f.fullname}</p>
              </div>
            </div>

            {currentUser?._id !== f._id && (
              <button
                onClick={() => handleFollow(f._id)}
                className={`w-20 h-7 rounded-md text-[14px] ${isFollowing ? 'bg-secondary' : 'bg-btn'}`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        )
      }
      )}
    </div>
  );
};


export default FollowersPage;
