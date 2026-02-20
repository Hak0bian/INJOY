import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { GrClose } from "react-icons/gr";
import { useAppDispatch } from "../../store/hooks";
import { createPost } from "../../store/postSlice/postThunk";

const AddPost = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const [newPost, setNewPost] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [text, setText] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewPost(e.target.files[0]);
        }
    };

    useEffect(() => {
        if (!newPost) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(newPost);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [newPost]);

    const handleSubmit = () => {
        const formData = new FormData();
        if (newPost) formData.append("image", newPost);
        if (text.trim()) formData.append("text", text);

        dispatch(createPost(formData))
            .unwrap()
            .then(() => {
                setNewPost(null);
                setText("");
                navigate("/my-profile");
            })
            .catch((err) => console.log("Post creation error:", err));
    };


    return (
        <div className="px-5 pt-10 text-center max-w-md mx-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-semibold">New Post</h2>
                <button onClick={() => navigate(-1)} className="sm:hidden">
                    <GrClose />
                </button>
            </div>

            <div className="aspect-4/5 bg-gray-500 relative mt-5 my-3 rounded-xl overflow-hidden">
                {preview && (
                    <img
                        src={preview}
                        alt="preview"
                        className="w-full h-full object-cover rounded-xl"
                    />
                )}

                <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                <label
                    htmlFor="file-input"
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-secondary p-2 rounded-full cursor-pointer"
                >
                    <MdOutlineAddPhotoAlternate className="text-[18px]" />
                </label>
            </div>

            <div>
                <textarea
                    className="w-full h-25 bg-secondary px-3 py-2 text-[14px] outline-0 rounded-xl resize-none"
                    placeholder="Add text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={!newPost}
                className={`mt-2 w-full h-8 rounded-lg transition-all duration-300
                    ${!newPost ? "bg-gray-500 cursor-not-allowed" : "bg-btn hover:bg-blue-600 cursor-pointer"}`}
            >
                Add
            </button>
        </div>
    );
};

export default AddPost;