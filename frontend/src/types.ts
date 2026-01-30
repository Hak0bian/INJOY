interface IProfile {
    username: string,
    photo?: string,
    bio?: string,
}

export interface IUser {
    _id: string;
    id: string;
    email: string;
    fullname: string;
    profileCompleted: boolean;
    profile: IProfile
}

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

export interface IProfileState {
    loading: boolean;
    error: string | null;
    initialized: boolean;
}


export interface IPost {
    _id: string;

    user: {
        _id: string;
        fullname: string;
        profile?: {
            username?: string;
            photo?: string;
        };
    };

    image?: string;
    text?: string;
    likes: string[];
    createdAt: string;
    updatedAt: string;

    comments: {
        user: string;
        text: string;
        createdAt: string;
    }[];

}

export interface IPostsState {
    posts: IPost[];
    createPostLoading: boolean;
    createPostError: string | null;
    getUserPostsLoading: boolean;
    getUserPostsError: string | null;
}

export interface IPostProps {
    id: string;
    image?: string;
    text?: string;
    likes: number;
    comments: number;
    userId: string; 
    user: {
        fullname: string;
        profile?: {
            username?: string;
            photo?: string;
            bio?: string
        };
    };
}
