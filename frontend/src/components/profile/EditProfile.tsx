import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { updateProfile } from "../../store/profileSlice/profileThunk";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import { SlRefresh } from "react-icons/sl";
import profile from "../../assets/images/profile.jpg";
import setupValidation from "../../validations/setupValidation";


const EditProfile = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const { user } = useAppSelector((state) => state.auth);
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const hasImage = profilePic || user?.profile?.photo;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePic(e.target.files[0]);
        }
    };

    const handleSubmit = (values: { fullname: string; username: string; bio: string }) => {
        const formData = new FormData();
        formData.append("fullname", values.fullname);
        formData.append("username", values.username);
        formData.append("bio", values.bio);
        if (profilePic) formData.append("photo", profilePic);
        dispatch(updateProfile(formData))
            .unwrap()
            .then(() => {
                navigate("/my-profile", { replace: true });
            })
            .catch((err) => {
                console.error("Profile update failed:", err);
            });
    };

    return (
        <div className="min-h-screen px-6 pt-10 bg-main flex flex-col items-center">
            <h2 className="text-[24px] font-semibold mb-6 text-mainText text-center">
                Edit Your Profile
            </h2>

            <div className="relative w-28 h-28 mb-6">
                <img
                    src={
                        profilePic
                            ? URL.createObjectURL(profilePic)
                            : user?.profile.photo
                                ? `http://localhost:5000/${user.profile.photo}`
                                : profile
                    }
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                />
                <label
                    htmlFor="file-input"
                    className="absolute bottom-0 right-0 bg-btn text-[20px] w-8 h-8  rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 duration-300"
                >
                    {hasImage ? <SlRefresh /> : "+"}
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
                enableReinitialize
                initialValues={{
                    fullname: user?.fullname || "",
                    username: user?.profile.username || "",
                    bio: user?.profile.bio || ""
                }}
                validationSchema={setupValidation}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form className="flex flex-col gap-2 w-full max-w-md">
                        <label>
                            <span className="text-sm text-graytext">Full name</span>
                            <Field
                                name="fullname"
                                type="text"
                                className="h-13 rounded-lg bg-secondary px-3 w-full outline-0 text-[14px] placeholder:text-[14px]"
                            />
                        </label>

                        <label>
                            <span className="text-sm text-graytext">Username</span>
                            <Field
                                name="username"
                                type="text"
                                className="h-13 rounded-lg bg-secondary px-3 w-full outline-0 text-[14px] placeholder:text-[14px]"
                            />
                            <ErrorMessage name="username" component="div" className="text-xs text-red-500 tracking-wider mt-1" />
                        </label>

                        <label>
                            <span className="text-sm text-graytext">Bio (optional)</span>
                            <Field
                                as="textarea"
                                name="bio"
                                className="h-40 rounded-lg bg-secondary p-3 w-full outline-0 text-[14px] placeholder:text-[14px] resize-none"
                            />
                        </label>

                        <button
                            type="submit"
                            className="h-13 bg-btn rounded-lg hover:bg-blue-600 cursor-pointer transition-all duration-300"
                        >
                            Save Edits
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EditProfile;