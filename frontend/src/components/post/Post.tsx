import post from '../../assets/images/post2.jpg'
import profile from '../../assets/images/profile.jpg'
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { NavLink } from 'react-router-dom';


const Post = () => {
    return (
        <div className='my-10'>
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl">
                <img src={post} className="block w-full h-full object-cover" />

                <NavLink to="">
                    <div className="absolute top-2 left-2 flex items-center gap-2 text-[14px]">
                        <img src={profile} className="w-8 h-8 rounded-full" />
                        <p className="font-semibold text-white">username__</p>
                    </div>
                </NavLink>

                <div className="absolute bottom-2 left-2 flex gap-4 bg-secondary px-5 py-2 rounded-xl">
                    <div className="flex gap-1 items-center">
                        <FaRegHeart />
                        <p>456</p>
                    </div>

                    <div className="flex gap-1 items-center">
                        <FaRegComment />
                        <p>45</p>
                    </div>

                    <button>
                        <FiSend />
                    </button>
                </div>
            </div>
            <p className='text-[12px] pt-1'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, repudiandae?</p>
        </div>
    );
};


export default Post