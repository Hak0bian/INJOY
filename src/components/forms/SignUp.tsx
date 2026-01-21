import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { registerUser } from "../../store/authSlice/authThunk";
import { FaRegUser } from "react-icons/fa6";
import { IoEyeOffOutline, IoEyeOutline, TfiEmail, LuLockKeyhole } from "../index";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const SignUp = () => {
    const [openPass, setOpenPass] = useState(false);
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state: any) => state.auth);

    const handleSubmit = (values: any, { resetForm }: { resetForm: () => void }) => {
        dispatch(registerUser(values))
            .unwrap()
            .then(() => resetForm())
            .catch((err: any) => console.log("Registration error:", err));
    };

    return (
        <div className="px-5 pt-20">
            <Formik
                initialValues={{ name: "", email: "", pass: "" }}
                onSubmit={handleSubmit}
            >
                <Form className="flex flex-col gap-5">
                    <h2 className="w-40 text-[28px] font-semibold mb-5">Create Your Account</h2>

                    <div className="flex items-center h-13 bg-secondary px-3 rounded-lg">
                        <FaRegUser className="text-gray-300" />
                        <Field name="name" placeholder="Full Name" className="pl-3 pr-6 w-full outline-0 placeholder:text-[14px]" />
                        <ErrorMessage name="name" component="div" />
                    </div>

                    <div className="flex items-center h-13 bg-secondary px-3 rounded-lg">
                        <TfiEmail className="text-gray-300 text-[18px]" />
                        <Field name="email" type="email" placeholder="Enter Your Email" className="pl-3 pr-6 w-full outline-0 placeholder:text-[14px]" />
                        <ErrorMessage name="email" component="div" />
                    </div>

                    <div className="flex items-center h-13 bg-secondary px-3 rounded-lg relative">
                        <LuLockKeyhole className="text-gray-300 text-[20px]" />
                        <Field name="pass" type={openPass ? "text" : "password"} placeholder="Password" className="pl-3 pr-6 w-full outline-0 placeholder:text-[14px]" />
                        <button type="button" onClick={() => setOpenPass(!openPass)} className="absolute right-2 top-5">
                            {openPass ? <IoEyeOutline /> : <IoEyeOffOutline />}
                        </button>
                        <ErrorMessage name="pass" component="div" />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

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
