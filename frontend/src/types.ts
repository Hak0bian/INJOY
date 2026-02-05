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
    profile: IProfile;
    followers?: string[];
    following?: string[];
    isFollowing?: boolean;
}

export interface IPost {
    post: any;
    _id: string;
    image?: string;
    text?: string;
    likes: string[];
    isLiked: boolean;
    commentsCount: number;
    totalComments?: number;
    createdAt: string;
    updatedAt: string;

    user: {
        _id: string;
        fullname: string;
        profile?: {
            username?: string;
            photo?: string;
        };
    };

    comments: {
        _id: string;
        text: string;
        createdAt: string;
        user: {
            _id: string;
            fullname: string;
            profile?: {
                username?: string;
                photo?: string;
            };
        };
    }[];
}

export interface IPostProps {
    id: string;
    image?: string;
    text?: string;
    likes: string[];
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

export interface ILikePostResponse {
    postId: string;
    liked: boolean;
    likes: string[]
}