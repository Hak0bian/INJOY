import { TfiEmail } from "react-icons/tfi"

const ForgotPass = () => {
    return (
        <div className="px-5 pt-20 flex flex-col gap-5">
            <h2 className="w-40 text-[28px] font-semibold mb-5">Forgot Password</h2>
            <p className="text-graytext text-[14px]">Enter your email address and we’ll send you a code to reset your password.</p>
            <div className="flex items-center h-13 bg-secondary px-3 rounded-lg">
                <TfiEmail className="text-gray-300 text-[18px]" />
                <input type="email" placeholder="Enter Your Email" className=" pl-3 pr-6 w-full outline-0 placeholder:text-[14px]" />
            </div>
            <button className="w-full h-13 bg-btn rounded-lg cursor-pointer mb-3 hover:bg-blue-600 duration-300">Next</button>
        </div>
    )
}

export default ForgotPass