import Image from 'next/image'

export default function Header(){
    return(
        <header>
            <div className="relative flex items-center py-[2.125rem] shadow-[0_35px_60px_-15px_rgba(255,255,255,0.2)] bg-gradient-to-r from-black to-violet-500">
                <Image className='ml-10' src="/attitune.png" width={100} height={50} />
                <div className="absolute inset-x-0 bottom-0 h-px bg-slate-900/5"></div>
            </div>
        </header>
    )
}