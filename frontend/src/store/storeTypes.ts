import type { IPost, IUser } from "../types";

export interface IAuthResponse {
    token: string;
    user: IUser;
}

export interface IAuthError {
    message: string;
}

export interface ILoginPayload {
    email: string;
    password: string;
}

export interface IRegisterPayload {
    username: string;
    email: string;
    password: string;
}

export interface IAuthState {
    user: IUser | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    initialized: boolean;
}

export interface IComment {
    _id: string;
    text: string;
    createdAt: string;
    parent?: string | null;
    replies?: IComment[];
    user: {
        _id: string;
        fullname: string;
        profile: {
            username?: string;
            photo?: string;
        };
    };
}

export interface CommentsState {
    comments: IComment[];
    loading: boolean;
}

interface IUserPreview {
    _id: string;
    fullname: string;
    profile?: {
        username?: string;
        photo?: string;
    };
}

export interface FollowersState {
    followers: IUserPreview[];
    following: IUserPreview[];
    followersCount: number;
    followingCount: number;
    loading: boolean;
    error: string | null;
}

export interface IPostsState {
    posts: IPost[];
    feedPosts: IPost[],
    recommendedPosts: IPost[]
    recLoading: boolean,
    recError: string | null,
    feedLoading: boolean,
    feedError: string | null,
    noMoreFeedPosts: boolean,
    createPostLoading: boolean;
    createPostError: string | null;
    getUserPostsLoading: boolean;
    getUserPostsError: string | null;
}

export interface IProfileState {
    loading: boolean;
    error: string | null;
    initialized: boolean;
}

export interface SavedState {
    savedItems: { postId: string; userId: string }[];
    posts: { post: any; user: any }[];
    loading: boolean;
    error: string | null;
}

export interface UsersState {
    otherUser: IUser | null;
    loading: boolean;
    error: string | null;
    searchResults: IUserPreview[];
    searchLoading: boolean;
    searchError: string | null;
}

export interface Message {
    _id: string;
    conversationId: string;
    sender: string;
    text: string;
    createdAt: string;
}

export interface MessageState {
    messages: Message[];
    loading: boolean;
    error: string | null;
    activeConversationId: string | null;
}


export interface Participant {
    _id: string;
    fullname: string;
    profile: {
        username?: string;
        photo?: string;
        bio?: string;
    }
};

export interface Conversation {
    _id: string;
    participants: Participant[];
    lastMessage: {
        text: string;
        sender: Participant;
        createdAt: string;
    } | null;
    updatedAt: string;
}

export interface ConversationState {
    conversations: Conversation[];
    currentConversation: any | null;
    loading: boolean;
    error: string | null;
    activeConversationId: string | null;
}