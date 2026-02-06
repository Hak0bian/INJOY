import { Route, Routes } from "react-router-dom"
import { useEffect } from "react"
import {
  HomePage, SignInPage, SignUpPage, ForgotPassPage, ProfileSetupPage, ProfilePage, UserProfilePage, FollowersPage,
  EditProfilePage, AddPostPage, UserPostsPage, SavedPostsPage, SavedPostDetailPage, SearchPage, SearchPostsPage, 
} from "./pages/Index"
import { Layout, AuthProfileGuard } from "./components/index"
import { useAppDispatch } from "./store/hooks"
import { loadUserFromToken } from "./store/profileSlice/profileThunk"


const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);


  return (
    <section className="min-h-screen bg-main text-maintext pb-20 select-none">
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/forgot-pass" element={<ForgotPassPage />} />
        <Route path="/profile-setup" element={
          <AuthProfileGuard requireProfileCompleted={false}>
            <ProfileSetupPage />
          </AuthProfileGuard>
        }
        />
        <Route path="/" element={
          <AuthProfileGuard>
            <Layout />
          </AuthProfileGuard>
        }
        >
          <Route index element={<HomePage />} />
          <Route path="/my-profile" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/user/:userId" element={<UserProfilePage />} />
          <Route path="/user/:id/followers" element={<FollowersPage type="followers" />} />
          <Route path="/user/:id/following" element={<FollowersPage type="following" />} />
          <Route path="/add-post" element={<AddPostPage />} />
          <Route path="/saved-posts" element={<SavedPostsPage />} />
          <Route path="/user/:userId/posts/:postId" element={<UserPostsPage />} />
          <Route path="/saved-posts" element={<SavedPostsPage />} />
          <Route path="/saved-posts/:postId" element={<SavedPostDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/search/rec-posts/:postId" element={<SearchPostsPage />} />
        </Route>
      </Routes>
    </section>
  )
}

export default App