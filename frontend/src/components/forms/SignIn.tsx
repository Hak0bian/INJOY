import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline, TfiEmail, LuLockKeyhole } from "../index";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser } from "../../store/authSlice/authThunk";
import loginValidation from "../../validations/loginValidation";


const SignIn = () => {
    const navigate = useNavigate();
    const [openPass, setOpenPass] = useState(false);
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const handleSubmit = (values: { email: string; password: string }, { resetForm }: { resetForm: () => void }) => {
        dispatch(loginUser(values))
            .unwrap()
            .then(() => {
                resetForm();
                navigate("/my-profile", { replace: true });
            })
            .catch((err: any) => console.log("Login error:", err));
    };

    return (
        <div className="px-5 pt-20">
            <Formik
                initialValues={{
                    email: "",
                    password: ""
                }}
                onSubmit={handleSubmit}
                validationSchema={loginValidation}
            >
                <Form className="flex flex-col gap-4">
                    <h2 className="w-40 text-[28px] font-semibold mb-5">Login Your Account</h2>

                    <div>
                        <label className="flex items-center h-13 bg-secondary px-3 rounded-lg relative">
                            <TfiEmail className="text-gray-300 text-[18px]" />
                            <Field
                                name="email"
                                type="email"
                                placeholder="Enter Your Email"
                                className="pl-3 pr-6 w-full outline-0 placeholder:text-[14px]"
                            />
                        </label>
                        <ErrorMessage name="email" component="div" className="text-xs text-red-500 tracking-wider mt-1" />
                    </div>

                    <div>
                        <label className="flex items-center h-13 bg-secondary px-3 rounded-lg relative">
                            <LuLockKeyhole className="text-gray-300 text-[20px]" />
                            <Field
                                name="password"
                                type={openPass ? "text" : "password"}
                                placeholder="Password"
                                className="pl-3 pr-6 w-full outline-0 placeholder:text-[14px]"
                            />
                            <button type="button" onClick={() => setOpenPass(!openPass)} className="absolute right-2 top-5">
                                {openPass ? <IoEyeOutline /> : <IoEyeOffOutline />}
                            </button>
                        </label>
                        <ErrorMessage name="password" component="div" className="text-xs text-red-500 tracking-wider mt-1" />
                    </div>

                    <NavLink to="/forgot-pass" className="text-graytext mt-2 block text-[14px] hover:text-white duration-300">
                        Forgot Password?
                    </NavLink>

                    {error && <p className="text-xs text-red-500 text-center tracking-wider">{error}</p>}

                    <button
                        type="submit"
                        className="w-full h-13 bg-btn rounded-lg cursor-pointer mb-3 hover:bg-blue-600 duration-300"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <div className="flex justify-center gap-2">
                        <p className="text-graytext">Create New Account?</p>
                        <p className="text-btn hover:text-blue-400 duration-300">
                            <NavLink to="/sign-up">Sign Up</NavLink>
                        </p>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default SignIn;