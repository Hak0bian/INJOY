import { Route, Routes } from "react-router-dom"
import { useEffect } from "react"
import {
  HomePage, SignInPage, SignUpPage, ProfileSetupPage, ProfilePage, UserProfilePage, FollowersPage, EditProfilePage, AddPostPage,
  UserPostsPage, SavedPostsPage, SavedPostDetailPage, SearchPage, SearchPostsPage, ChatPage, ConversationsPage, NotificationsPage
} from "./pages/Index"
import { Layout, AuthProfileGuard, MessageToast, SocketListener } from "./components/index"
import { useAppDispatch, useAppSelector } from "./store/hooks"
import { loadUserFromToken } from "./store/profileSlice/profileThunk"
import socket from "./socket/socket";
import { updateLastMessage } from "./store/conversationSlice/conversationSlice"
import type { ILastMessage } from "./store/storeTypes"
import { addNotification } from "./store/notificationsSlice/notificationsSlice"
import notificationsSound from './assets/sounds/notification.mp3'
import { markAllAsRead } from "./store/notificationsSlice/notificationsThunk"
import { useJoinConversations } from "./socket/useJoinConversations"

const App = () => {
  const dispatch = useAppDispatch();
  const { currentConversation } = useAppSelector(state => state.conversations)
  const { toastMessage } = useAppSelector(state => state.messages)

  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    socket.auth = { token };
    socket.connect();

    socket.on("newMessage", (msg: ILastMessage) => {
      const newMsg: ILastMessage = { ...msg, updatedAt: msg.updatedAt || msg.createdAt };
      dispatch(updateLastMessage({ conversationId: msg.conversationId, message: newMsg }));

      if (msg.conversationId === currentConversation?._id) {
        dispatch({ type: "messages/addMessage", payload: newMsg });
      } else {
        dispatch({ type: "messages/showToast", payload: newMsg });
      }
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
      dispatch({ type: "messages/markSeen", payload: { conversationId, userId } });
      dispatch({ type: "conversations/markConversationSeen", payload: { conversationId, userId } });
    });

    socket.on("messageDeleted", ({ messageId, conversationId }) => {
      dispatch({ type: "messages/deleteMessageLocal", payload: messageId });
      dispatch({ type: "conversations/removeLastIfDeleted", payload: { messageId, conversationId } });
    });

    socket.on("newNotification", async (notification) => {
      if (location.pathname.includes("/notifications")) {
        dispatch(addNotification({ ...notification, isRead: true }));
        dispatch(markAllAsRead());
      } else {
        dispatch(addNotification(notification));
        const audio = new Audio(notificationsSound);
        audio.play().catch(() => { });
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("onlineUsers");
      socket.off("userDisconnected");
      socket.off("messagesSeen");
      socket.off("messageDeleted");
      socket.off("newNotification");
      socket.disconnect();
    };
  }, [dispatch]);

  useJoinConversations();

  return (
    <section className="min-h-screen bg-main text-maintext pb-20 select-none">
      {toastMessage && <MessageToast message={toastMessage} />}
      <>
        <SocketListener />
        <Routes>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
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
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
        </Routes>
      </>
    </section>
  )
}

export default App