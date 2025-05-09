import { useTheme } from "../hooks/useTheme"
import { HiMiniSun, HiMiniMoon } from "react-icons/hi2"
import { GiRunningNinja } from "react-icons/gi";
import { SiGithub } from "react-icons/si"


export function NavBar(){
    return (
        <header className="sticky top-0 z-10 w-full border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <div className="flex h-16 items-center px-4 sm:px-8 lg:px-44">
                <div className="mx-auto w-full max-w-3xl space-y-20">
                <div className="flex justify-between">
                    <div className="flex flex-1 items-center justify-start">
                        {/*link and site name icon*/}
<a className="h-10 w-10 p-2 text-gray-800 dark:text-white" href="">
    <GiRunningNinja className="size-full"/>
</a>
</div>
                    
                    <div className="flex flex-1 items-center justify-end">
                        <nav className="flex items-center space-x-1">
                            <ThemeToggle/>
                            <a href="https://github.com/rosiearasa/rundash"
                            target="_blank"
                            className="h-10 w-10 p-2 text-gray-800 hover:text-[#4078c0]
                            dark:text-white dark:hover:text-[#4078c0]">
                                <SiGithub className="h-full w-full"/>
                            </a>

                        </nav>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

function ThemeToggle(){
    const {isDarkMode, toggleDarkMode}= useTheme()
    return (
        <button
        className="h-10 w-10 p-2 text-gray-800 hover:text-amber-500 dark:text-white dark:hover:text-amber-400"
        onClick={() => toggleDarkMode()}
        >
            {isDarkMode?(
                <HiMiniMoon className='h-full w-full'/>
            ):(
                <HiMiniSun className='h-full w-full'/>
            )}
            
        </button>
    )
}