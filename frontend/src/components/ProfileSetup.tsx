import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import profile from "../assets/images/profile.jpg";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../store/profileSlice/profileThunk";


const ProfileSetup = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    const [profilePic, setProfilePic] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePic(e.target.files[0]);
        }
    };

    const handleSubmit = (values: { username: string; bio: string }) => {
        const formData = new FormData();
        formData.append("username", values.username);
        formData.append("bio", values.bio);

        if (profilePic) {
            formData.append("photo", profilePic);
        }

        dispatch(updateProfile(formData));
    };

    useEffect(() => {
        if (user?.profileCompleted) {
            navigate("/my-profile");
        }
    }, [user, navigate]);


    return (
        <div className="min-h-screen px-6 pt-10 bg-main flex flex-col items-center">
            <h2 className="text-[24px] font-semibold mb-6 text-mainText text-center">Setup Your Profile</h2>

            <div className="relative w-28 h-28 mb-6">
                <img
                    src={profilePic ? URL.createObjectURL(profilePic) : profile}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                />
                <label
                    htmlFor="file-input"
                    className="absolute bottom-0 right-0 bg-btn text-[20px] w-8 h-8 pb-1 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 duration-300"
                >
                    +
                </label>
                <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            <Formik
                initialValues={{
                    username: "",
                    bio: ""
                }}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form className="flex flex-col gap-4 w-full max-w-sm">
                        <Field
                            name="username"
                            type="text"
                            placeholder="Username"
                            className="h-13 rounded-lg bg-secondary px-3 w-full outline-0 text-[14px] placeholder:text-[14px]"
                        />
                        <Field
                            as="textarea"
                            name="bio"
                            placeholder="Bio (optional)"
                            className="h-40 rounded-lg bg-secondary p-3 w-full outline-0 text-[14px] placeholder:text-[14px] resize-none"
                        />
                        <button type="submit" className="h-13 bg-btn rounded-lg hover:bg-blue-600 cursor-pointer transition-all duration-300">
                            Save
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ProfileSetup;