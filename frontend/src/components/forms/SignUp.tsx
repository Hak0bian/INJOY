import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { registerUser } from "../../store/authSlice/authThunk";
import { FaRegUser } from "react-icons/fa6";
import { IoEyeOffOutline, IoEyeOutline, TfiEmail, LuLockKeyhole } from "../index";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import registerValidation from "../../validations/registerValidation";
import { clearError } from "../../store/authSlice/authSlice";


const SignUp = () => {
    const navigate = useNavigate();
    const [openPass, setOpenPass] = useState(false);
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state: any) => state.auth);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleSubmit = (values: any, { resetForm }: { resetForm: () => void }) => {
        dispatch(registerUser(values))
            .unwrap()
            .then((res) => {
                resetForm();
                if (!res.user.profileCompleted) {
                    navigate("/profile-setup");
                } else {
                    navigate("/my-profile");
                }
            })
            .catch((err: any) => {
                console.log("Registration error:", err);
            });
    };

    return (
        <div className="px-5 pt-20 xs:px-15">
            <Formik
                initialValues={{
                    username: "",
                    email: "",
                    password: ""
                }}
                onSubmit={handleSubmit}
                validationSchema={registerValidation}
            >
                <Form className="flex flex-col gap-4 max-w-[500px] mx-auto sm:border border-graytext sm:px-5 sm:py-15 rounded-2xl">
                    <h2 className="w-40 text-[28px] font-semibold mb-5 xs:w-full xs:text-center">Create Your Account</h2>

                    <div>
                        <label className="flex items-center h-13 bg-secondary px-3 rounded-lg">
                            <FaRegUser className="text-gray-300" />
                            <Field name="username" placeholder="Full Name" className="pl-3 pr-6 w-full outline-0 placeholder:text-[14px]" />
                        </label>
                        <ErrorMessage name="username" component="div" className="text-xs text-red-500 tracking-wider mt-1" />
                    </div>

                    <div>
                        <label className="flex items-center h-13 bg-secondary px-3 rounded-lg">
                            <TfiEmail className="text-gray-300 text-[18px]" />
                            <Field name="email" type="email" placeholder="Enter Your Email" className="pl-3 pr-6 w-full outline-0 placeholder:text-[14px]" />
                        </label>
                        <ErrorMessage name="email" component="div" className="text-xs text-red-500 tracking-wider mt-1" />
                    </div>

                    <div>
                        <label className="flex items-center h-13 bg-secondary px-3 rounded-lg relative">
                            <LuLockKeyhole className="text-gray-300 text-[20px]" />
                            <Field name="password" type={openPass ? "text" : "password"} placeholder="Password" className="pl-3 pr-6 w-full outline-0 placeholder:text-[14px]" />
                            <button type="button" onClick={() => setOpenPass(!openPass)} className="absolute right-2 top-5">
                                {openPass ? <IoEyeOutline /> : <IoEyeOffOutline />}
                            </button>
                        </label>
                        <ErrorMessage name="password" component="div" className="text-xs text-red-500 tracking-wider mt-1" />
                    </div>

                    {error && <p className="text-xs text-red-500 text-center tracking-wider">{error}</p>}

                    <div>
                        <button type="submit" className="w-full h-13 bg-btn rounded-lg cursor-pointer mb-3 hover:bg-blue-600 duration-300" disabled={loading}>
                            {loading ? "Registering..." : "Register"}
                        </button>

                        <div className="flex justify-center gap-2">
                            <p className="text-graytext">Already Have An Account?</p>
                            <p className="text-btn hover:text-blue-400 duration-300"><NavLink to="/sign-in">Sign In</NavLink></p>
                        </div>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default SignUp;