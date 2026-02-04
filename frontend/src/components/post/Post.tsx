import { useState } from "react";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { GoBookmarkFill, GoBookmark } from "react-icons/go";
import { FaHeart } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { IPostProps } from "../../types";
import { updatePostText, deletePost, likePost } from "../../store/postSlice/postThunk";
import CommentsPanel from "./CommentsPanel";
import { toggleSavedPost } from "../../store/SavedSlice/SavedSlice";
import profileImg from "../../assets/images/profile.jpg"


const Post = ({ id, user, image, text, likes, comments, userId }: IPostProps) => {
    const dispatch = useAppDispatch();
    const authUser = useAppSelector((state) => state.auth.user);
    const authUserId = authUser?._id || authUser?.id;
    const [openOptions, setOpenOptions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(text || "");
    const [commentsOpen, setCommentsOpen] = useState(false);
    const isLiked = authUserId ? likes.includes(authUserId) : false;
    const isOwnPost = authUserId === userId;
    const { savedItems } = useAppSelector((state) => state.saved);
    const saved = savedItems.some(item => item.postId === id && item.userId === userId);

    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!id || !userId) return;

        dispatch(toggleSavedPost({ postId: id, userId }));
    };

    const handleLike = () => {
        dispatch(likePost(id));
    };

    const handleSaveText = () => {
        dispatch(updatePostText({ postId: id, text: editedText }))
            .unwrap()
            .then(() => setIsEditing(false))
            .catch((err) => console.error("Update failed", err));
    };

    const handleDelete = () => {
        dispatch(deletePost(id));
    };


    return (
        <div className="my-10">
            <div className="flex items-center justify-between mb-2">
                <NavLink to={`/user/${userId}`}>
                    <div className="flex items-center gap-2 text-[14px]">
                        <img
                            src={
                                user.profile?.photo
                                    ? `http://localhost:5000/${user.profile.photo.replace("\\", "/")}`
                                    : profileImg
                            }
                            alt={user.fullname}
                            className="w-8 h-8 rounded-full"
                        />
                        <p className="font-semibold text-white">
                            {user.profile?.username || user.fullname}
                        </p>
                    </div>
                </NavLink>

                {isOwnPost && (
                    <button
                        onClick={() => setOpenOptions(!openOptions)}
                        className="text-[20px] cursor-pointer mt-1"
                    >
                        <IoEllipsisVertical />
                    </button>
                )}
            </div>

            <div className="relative overflow-hidden rounded-xl aspect-4/5">
                {image && (
                    <img
                        src={`http://localhost:5000/${image.replace("\\", "/")}`}
                        className="w-full h-full object-cover"
                    />
                )}

                <div className="absolute bottom-2 left-2 flex gap-4 bg-secondary px-5 py-2 rounded-xl">
                    <div className="flex gap-1 items-center ">
                        <button
                            onClick={handleLike}
                            className="cursor-pointer"
                        >
                            {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                        </button>
                        {likes.length}
                    </div>
                    <div className="flex gap-1 items-center">
                        <button
                            onClick={() => setCommentsOpen(true)}
                            className="cursor-pointer"
                        >
                            <FaRegComment />
                        </button>
                        {comments}
                    </div>
                    <button onClick={handleSavePost} className="text-[18px]">
                        {
                            saved ? <GoBookmarkFill /> : <GoBookmark />
                        }
                    </button>
                </div>

                {openOptions && (
                    <div className="absolute top-0 right-0 flex flex-col items-baseline gap-2 bg-secondary py-5 pl-3 pr-6 text-[14px]">
                        <button
                            onClick={() => {
                                setIsEditing(true);
                                setOpenOptions(false);
                            }}
                            className="cursor-pointer"
                        >
                            Edit Text
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-red-500 cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {commentsOpen && (
                <CommentsPanel
                    postId={id}
                    onClose={() => setCommentsOpen(false)}
                />
            )}

            {isEditing ? (
                <div className="flex gap-1 pt-2">
                    <input
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="w-full outline-0 text-[14px] border-b border-gray-500"
                    />
                    <button onClick={handleSaveText} className="text-green-500 text-[16px] cursor-pointer">✔</button>
                </div>
            ) : (
                text && <p className="text-[14px] pt-2 px-1">{text}</p>
            )}
        </div>
    );
};

export default Post;