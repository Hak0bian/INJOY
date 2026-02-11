import { Route, Routes } from "react-router-dom"
import { useEffect } from "react"
import {
  HomePage, SignInPage, SignUpPage, ForgotPassPage, ProfileSetupPage, ProfilePage, UserProfilePage, FollowersPage, EditProfilePage, AddPostPage,
  UserPostsPage, SavedPostsPage, SavedPostDetailPage, SearchPage, SearchPostsPage, ChatPage, ConversationsPage
} from "./pages/Index"
import { Layout, AuthProfileGuard } from "./components/index"
import { useAppDispatch } from "./store/hooks"
import { loadUserFromToken } from "./store/profileSlice/profileThunk"
import socket from "./socket/socket";
import { updateLastMessage } from "./store/conversationSlice/conversationSlice"
import type { ILastMessage } from "./store/storeTypes"


const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    socket.auth = { token };
    socket.connect();

    socket.on("newMessage", (msg: ILastMessage) => {
      const newMsg: ILastMessage = {
        ...msg,
        updatedAt: msg.updatedAt || msg.createdAt,
      };

      dispatch(updateLastMessage({
        conversationId: msg.conversationId,
        message: newMsg
      }));

      dispatch({ type: "messages/addMessage", payload: newMsg });
    });

    socket.on("onlineUsers", (users: string[]) => {
      users.forEach((userId) => {
        dispatch({ type: "users/addOnlineUser", payload: userId });
      });
    });

    socket.on("userDisconnected", (userId: string) => {
      dispatch({ type: "users/removeOnlineUser", payload: userId });
    });

    socket.on("messagesSeen", ({ conversationId, userId }) => {
      dispatch({
        type: "messages/markSeen",
        payload: { conversationId, userId },
      });

      dispatch({
        type: "conversations/markConversationSeen",
        payload: { conversationId, userId },
      });
    });

    socket.on("messageDeleted", ({ messageId, conversationId }) => {
      dispatch({
        type: "messages/deleteMessageLocal",
        payload: messageId,
      });

      dispatch({
        type: "conversations/removeLastIfDeleted",
        payload: { messageId, conversationId },
      });
    });

    return () => {
      socket.off("newMessage");
      socket.off("onlineUsers");
      socket.off("userOffline");
      socket.off("messagesSeen");
      socket.off("messageDeleted");
      socket.disconnect();
    };
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
        } />
        <Route path="/" element={
          <AuthProfileGuard>
            <Layout />
          </AuthProfileGuard>
        }>
          <Route index element={<HomePage />} />
          <Route path="/my-profile" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/user/:userId" element={<UserProfilePage />} />
          <Route path="/user/:id/followers" element={<FollowersPage type="followers" />} />
          <Route path="/user/:id/following" element={<FollowersPage type="following" />} />
          <Route path="/add-post" element={<AddPostPage />} />
          <Route path="/saved-posts" element={<SavedPostsPage />} />
          <Route path="/user/:userId/posts/:postId" element={<UserPostsPage />} />
          <Route path="/saved-posts/:postId" element={<SavedPostDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/search/rec-posts/:postId" element={<SearchPostsPage />} />
          <Route path="/messages" element={<ConversationsPage />} />
          <Route path="/messages/:conversationId" element={<ChatPage />} />
        </Route>
      </Routes>
    </section>
  )
}

export default App