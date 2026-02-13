import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getComments, addComment } from "../../store/commentsSlice/commentsThunk";
import { clearComments } from "../../store/commentsSlice/commentsSlice";
import { BiSend } from "react-icons/bi";
import Comments from "./Comments";


const CommentsPanel = ({ postId, onClose }: { postId: string; onClose: () => void }) => {
    const dispatch = useAppDispatch();
    const { comments, loading } = useAppSelector(state => state.comments);
    const [text, setText] = useState("");
    const [visible, setVisible] = useState(false);
    const [replyTo, setReplyTo] = useState<{ username: string; id: string } | null>(null);

    useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);
    useEffect(() => {
        dispatch(getComments(postId));
        return () => { void dispatch(clearComments()); };
    }, [postId]);

    const handleClose = () => { setVisible(false); setTimeout(onClose, 300); };
    const handleAdd = () => {
        if (!text.trim()) return;
        dispatch(addComment({ postId, text, parent: replyTo?.id }));
        setText(""); setReplyTo(null);
    };

    return (
        <div className="fixed inset-0 z-50">
            <div onClick={handleClose} className={`absolute inset-0 bg-black transition-opacity duration-300 ${visible ? "opacity-40" : "opacity-0"}`} />
            <div
                className={`absolute bottom-0 left-0 right-0 h-[70%] bg-secondary rounded-t-2xl flex flex-col transform transition-transform duration-300 
                    ${visible ? "translate-y-0" : "translate-y-full"}`}
            >
                <div className="flex justify-between px-4 py-3 border-b border-gray-500">
                    <p className="font-semibold">Comments</p>
                    <button
                        onClick={handleClose}
                        className="cursor-pointer">
                        <IoClose size={22} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                    {loading && <p className="text-center">Loading...</p>}
                    {!loading && comments.length === 0 &&
                        <p className="text-[14px] text-center text-graytext pt-3">No comments yet</p>}
                    {!loading && comments.map(c => (
                        <Comments key={c._id} comment={c} setReplyTo={setReplyTo} />
                    ))}
                </div>

                {replyTo && (
                    <div className="flex justify-between items-center text-[12px] text-blue-500 px-5 py-2 border-t border-gray-500 rounded-xl">
                        <p>Replying to @{replyTo.username}</p>
                        <button onClick={() => setReplyTo(null)} className="text-[14px] cursor-pointer">
                            <IoClose />
                        </button>
                    </div>
                )}
                <div className="border-t border-gray-500 px-4 py-2 flex flex-col gap-1">
                    <div className="flex gap-2">
                        <input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={replyTo ? "Reply..." : "Add a comment..."}
                            className="flex-1 bg-transparent outline-0"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAdd();
                                }
                            }}
                        />
                        <button onClick={handleAdd} className="text-btn font-semibold text-[20px] cursor-pointer">
                            <BiSend />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentsPanel;