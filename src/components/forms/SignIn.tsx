import { Formik, Form, Field, ErrorMessage } from "formik"
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline, TfiEmail, LuLockKeyhole } from "../index"


const SignIn = () => {
    const [openPass, setOpenPass] = useState<boolean>(false)

    const handleSubmit = (_: any, { resetForm }: { resetForm: () => void }) => {
        resetForm();
    };

    return (
        <div className="px-5 pt-20">
            <Formik
                initialValues={{
                    email: "",
                    pass: "",
                }}
                onSubmit={handleSubmit}
            // validationSchema={registerValidation()}
            >
                <Form className="flex flex-col gap-5">
                    <h2 className="w-40 text-[28px] font-semibold mb-5">Login Your Accaunt</h2>

                    <div className="flex items-center h-13 bg-secondary px-3 rounded-lg">
                        <TfiEmail className="text-gray-300 text-[18px]" />
                        <Field name='email' type='email' placeholder='Enter Your Email' className="pl-3 pr-6 w-full outline-0 placeholder:text-[14px]"/>
                        <ErrorMessage name="email" component="div" />
                    </div>

                  <div>
                    <div className="flex items-center h-13 bg-secondary px-3 rounded-lg relative">
                        <LuLockKeyhole className="text-gray-300 text-[20px]" />
                        <Field name='pass' type={openPass ? 'text' : 'password'} placeholder='Password' className="pl-3 pr-6 w-full outline-0 placeholder:text-[14px]"/>
                        <button type="button" onClick={() => setOpenPass(!openPass)} className="absolute right-2 top-5">
                            { openPass ? <IoEyeOutline /> : <IoEyeOffOutline /> }
                        </button>
                        <ErrorMessage name="pass" component="div" />
                    </div>
                    <NavLink to='/forgot-pass' className="text-graytext mt-2 block text-[14px] hover:text-white duration-300">Forgot Password?</NavLink>
                  </div>

                    <div className="">
                        <button type="submit" className="w-full h-13 bg-btn rounded-lg cursor-pointer mb-3 hover:bg-blue-600 duration-300">Login</button>
                        <div className="flex justify-center gap-2">
                            <p className="text-graytext">Create New Account?</p>
                            <p className="text-btn hover:text-blue-400 duration-300"><NavLink to='/sign-up'>Sign Up</NavLink></p>
                        </div>
                    </div>
                </Form>
            </Formik>
        </div>
    )
}

export default SignIn