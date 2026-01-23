interface IProfile {
    username: string,
    photo?: string,
    bio?: string,
}

export interface IUser {
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

export interface AuthState {
    user: IUser | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    initialized: boolean;
}