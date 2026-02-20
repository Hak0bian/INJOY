import { useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import profile from "../assets/images/profile.jpg";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getFollowers, getFollowing } from "../store/followSlice/followersThunk";
import { followUser } from "../store/usersSlice/usersThunk";
import { FaArrowLeft } from "react-icons/fa6";


const FollowersPage: React.FC<{ type: "followers" | "following" }> = ({ type }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>();
  const { followers, following, loading, error } = useAppSelector(state => state.followers);
  const { user: currentUser } = useAppSelector(state => state.auth);
  const authUserId = currentUser?.id || currentUser?._id;
  const requestId = id || authUserId;
  const users = type === "followers" ? followers : following;

  useEffect(() => {
    if (!requestId) return;

    if (type === "followers") {
      dispatch(getFollowers(requestId));
    } else {
      dispatch(getFollowing(requestId));
    }
  }, [requestId, type, dispatch]);


  const handleFollow = (id: string) => {
    if (id) {
      dispatch(followUser(id));
    }
  };

  if (loading) return <p className="text-center pt-10">Loading...</p>;
  
  return (
    <div className="pt-2">
      <div className="flex items-center gap-4 fixed top-0 z-10 bg-main w-full px-3 py-2 border-b border-secondary">
        <button onClick={() => navigate(-1)} className="cursor-pointer">
          <FaArrowLeft />
        </button>
        <h3>{type === "followers" ? "Followers" : "Following"}</h3>
      </div>

      {loading && <p className="text-center pt-10">Loading...</p>}
      {!loading && error && <p className="text-center pt-10 text-red-500">{error}</p>}

      {!loading && !error && users.length === 0 && (
        <p className="text-[14px] text-center pt-10 text-graytext">
          {type === "followers"
            ? "No followers yet"
            : "Not following anyone yet"}
        </p>
      )}

      {!loading && !error && users.length > 0 && (
        <div>
          {users.map((f) => {
            const isFollowing = currentUser?.following?.includes(f._id);
            return (
              <div key={f._id} className="flex justify-between items-center px-3 py-2">
                <NavLink to={`/user/${f._id}`} className='w-full'>
                  <div className="flex items-center gap-2 text-[14px] ">
                    <img
                      src={f.profile?.photo ? `http://localhost:5000/${f.profile.photo.replace("\\", "/")}` : profile}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p>{f.profile?.username}</p>
                      <p className="text-graytext">{f.fullname}</p>
                    </div>
                  </div>
                </NavLink>

                {currentUser?._id !== f._id && (
                  <button
                    onClick={() => handleFollow(f._id)}
                    className={`w-25 h-7 rounded-md text-[13px] cursor-pointer ${isFollowing ? "bg-secondary" : "bg-btn"}`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FollowersPage;