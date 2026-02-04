import { deleteComment } from "../../store/commentsSlice/commentsThunk";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { IoClose } from "react-icons/io5";
import profileImg from "../../assets/images/profile.jpg"
import type { IComment } from "../../store/storeTypes";

const Comments = ({ comment }: { comment: IComment }) => {
    const dispatch = useAppDispatch();
    const authUser = useAppSelector(state => state.auth.user);
    const isOwnComment = authUser && (comment.user._id === authUser._id || comment.user._id === authUser.id)

    return (
        <div className="flex justify-between">
            <div className="flex justify-between items-center gap-2">
                <img
                    src={
                        comment.user.profile?.photo
                            ? `http://localhost:5000/${comment.user.profile.photo}`
                            : profileImg
                    }
                    className="w-8 h-8 rounded-full"
                />
                <div>
                    <p className="text-[14px] font-semibold">
                        {comment.user.profile?.username || comment.user.fullname}
                    </p>
                    <p className="text-[12px]">{comment.text}</p>
                </div>
            </div>

            {isOwnComment && (
                <button
                    onClick={() => dispatch(deleteComment(comment._id))}
                    className="cursor-pointer text-graytext hover:text-red-500"
                >
                    <IoClose />
                </button>
            )}
        </div>
    );
};

export default Comments;