import { IoClose } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import profileImg from "../../assets/images/profile.jpg";
import { deleteComment } from "../../store/commentsSlice/commentsThunk";
import type { IComment } from "../../store/storeTypes";
import { formatDistanceToNow } from "date-fns";

interface ICommentsProps {
    comment: IComment;
    setReplyTo?: (reply: { username: string; id: string }) => void;
}

const Comments = ({ comment, setReplyTo }: ICommentsProps) => {
    const dispatch = useAppDispatch();
    const authUser = useAppSelector(state => state.auth.user);
    const isOwnComment = authUser && (comment.user._id === authUser._id || comment.user._id === authUser.id);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between">
                <div className="flex gap-2 cursor-pointer">
                    <img
                        className="w-8 h-8 rounded-full mt-2 object-cover"
                        src={comment.user.profile?.photo
                            ? `http://localhost:5000/${comment.user.profile.photo}`
                            : profileImg} 
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-[14px] font-semibold">
                                {comment.user.profile?.username || comment.user.fullname}
                            </p>
                            <p className="text-[10px] text-graytext pt-1">{formatDistanceToNow(new Date(comment.createdAt))} ago</p>
                        </div>
                        <p className="text-[12px]">
                            {comment.text}
                        </p>

                        {setReplyTo && !comment.parent && (
                            <button
                                onClick={() => setReplyTo({ username: comment.user.profile?.username || comment.user.fullname, id: comment._id })}
                                className="text-blue-500 text-[12px] cursor-pointer pb-2"
                            >
                                Reply
                            </button>
                        )}
                    </div>
                </div>
                {isOwnComment && (
                    <button
                        onClick={() => dispatch(deleteComment(comment._id))}
                        className="text-graytext cursor-pointer"
                    >
                        <IoClose />
                    </button>
                )}
            </div>

            {comment.replies && comment.replies.length > 0 && (
                <div className="flex flex-col gap-2 ml-8">
                    {comment.replies.map(r => (
                        <Comments key={r._id} comment={r} setReplyTo={setReplyTo} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comments;