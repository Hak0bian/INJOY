import Friends from "../components/Friends"

const HomePage = () => {
  return (
    <section className="px-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold tracking-widest py-3">INJOY</h1>
      </div>
      <Friends />
    </section>
  )
}

export default HomePage