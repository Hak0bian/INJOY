import Friends from "../components/Friends"
import Post from "../components/post/Post"
import { BsSearch } from "react-icons/bs";

const HomePage = () => {
  return (
    <section className="px-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold tracking-widest py-3">INJOY</h1>
        <button className="text-[18px]">
          <BsSearch />
        </button>
      </div>
      <Friends />
      <Post />
      <Post />
      <Post />
      <Post />
    </section>
  )
}

export default HomePage