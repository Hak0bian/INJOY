import profile from '../../assets/images/profile.jpg'

const Followers = () => {
  return (
    <div className='px-5 py-5'>
        <h3 className='text-center font-semibold'>_username_</h3>
        <p className='text-[14px] mb-3'>Followers</p>

        <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2 text-[14px]'>
                <img src={profile} className='w-12 h-12 rounded-full'/>
                <div>
                    <p>username_____</p>
                    <p className='text-graytext'>full name</p>
                </div>
            </div>
            <button className='w-20 h-7 bg-btn rounded-md text-[14px ]'>Follow</button>
        </div>

        <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2 text-[14px]'>
                <img src={profile} className='w-12 h-12 rounded-full'/>
                <div>
                    <p>username_____</p>
                    <p className='text-graytext'>full name</p>
                </div>
            </div>
            <button className='w-20 h-7 bg-btn rounded-md text-[14px ]'>Follow</button>
        </div>

        <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2 text-[14px]'>
                <img src={profile} className='w-12 h-12 rounded-full'/>
                <div>
                    <p>username_____</p>
                    <p className='text-graytext'>full name</p>
                </div>
            </div>
            <button className='w-20 h-7 bg-btn rounded-md text-[14px ]'>Follow</button>
        </div>
    </div>
  )
}

export default Followers