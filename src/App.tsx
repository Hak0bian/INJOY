import { Route, Routes } from "react-router-dom"
import { HomePage, SignInPage, SignUpPage, ForgotPassPage, ProfileSetupPage, PorofilePage, UserProfilePage, FollowersPage } from "./pages/Index"
import Layout from "./components/Layout"


const App = () => {
  return (
    <section className="min-h-screen bg-main text-maintext pb-20">
      <Routes>
        <Route path='/' element={<Layout />} >
          <Route index element={<HomePage/>} />
          <Route path="/sign-in" element={<SignInPage/>} />
          <Route path="/sign-up" element={<SignUpPage/>} />
          <Route path="/forgot-pass" element={<ForgotPassPage/>} />
          <Route path="/profile-setup" element={<ProfileSetupPage/>} />
          <Route path="/my-profile" element={<PorofilePage/>} />
          <Route path="/user-profile" element={<UserProfilePage/>} />
          <Route path="/followers" element={<FollowersPage/>} />
        </Route>
      </Routes>
    </section>
  )
}

export default App