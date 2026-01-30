import { Route, Routes } from "react-router-dom"
import { useEffect } from "react"
import { HomePage, SignInPage, SignUpPage, ForgotPassPage, ProfileSetupPage, ProfilePage, UserProfilePage, FollowersPage,
    EditProfilePage, AddPostPage, UserPostsPage, 
} from "./pages/Index"
import { Layout, ProfileGuard, ProfileSetupGuard } from "./components/index"
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
        <Route path='/' element={<Layout />} >
          <Route index element={<HomePage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/forgot-pass" element={<ForgotPassPage />} />
          <Route
            path="/profile-setup"
            element={
              <ProfileSetupGuard>
                <ProfileSetupPage />
              </ProfileSetupGuard>
            }
          />
          <Route
            path="/my-profile"
            element={
              <ProfileGuard>
                <ProfilePage />
              </ProfileGuard>
            }
          />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/user-profile" element={<UserProfilePage />} />
          <Route path="/followers" element={<FollowersPage />} />
          <Route path="/add-post" element={<AddPostPage />} />
          <Route path="/posts/:postId" element={<UserPostsPage />} />
        </Route>
      </Routes>
    </section>
  )
}

export default App