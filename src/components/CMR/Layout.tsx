/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaUsers, FaBook, FaSignOutAlt, FaUsersCog, FaRegStickyNote, FaHome } from "react-icons/fa";
import { LuMessagesSquare } from "react-icons/lu";

import Icon from './Icon';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthProvider } from '../../hooks/useAuthProvider';
import { useAppStore } from '../../store';
import { jwtDecode } from 'jwt-decode';
import { MdSpeakerNotesOff } from "react-icons/md";
import { GrNotes } from "react-icons/gr";

import useBlog from "../../hooks/useBlog";

type TLinks = {
  text: string,
  Icon: JSX.Element,
  link: string,
  action?: () => void
}

const Layout = ({ Component }: { Component: any }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { getBlogCount } = useBlog({})
  const { data } = getBlogCount()
  const { signout } = useAuthProvider()
  const { setModal } = useAppStore()
  const auth = localStorage.getItem('auth_token') && jwtDecode(String(localStorage.getItem('auth_token'))) as any

  const setDescriptionName = () => {
    const nameDescription: { [index: string]: string } = {
      main: 'Main',
      clients: 'Clients',
      client: "Client",
      account: "Accounting",
      users: 'Users',
      chat: 'Chat'
    }
    const paths = location.pathname.split('/').filter(item => item)

    return nameDescription[paths[1]]
  }

  const setUrl = (type: 'url' | 'errorMsg') => {
    const paths = location.pathname.split('/').filter(item => item)
    if (paths.length > 2) {
      return type === 'url' ? '/intranet/account/' + paths[2] : ''
    } else {
      return type === 'url' ? '' : 'Selecciona un cliente primero'
    }
  }

  const handleSignOut = () => {
    signout()
    localStorage.removeItem('chat-loaded')
    navigate('/')
  }

  const handleBlogOpen = () => {
    setModal({ type: 'blog' })
  }

  const links: TLinks[] = [
    {
      link: '/intranet/chat',
      text: 'Chat',
      Icon: <LuMessagesSquare />
    },
    {
      link: '',
      text: 'Post',
      Icon: <FaRegStickyNote />,
      action: handleBlogOpen
    },
    {
      link: '',
      text: 'Sign out',
      Icon: <FaSignOutAlt />,
      action: handleSignOut
    },
  ]

  return (
    <div className='h-screen grid grid-cols-1 grid-rows-10 lg:grid-cols-[15%_1fr] text-white'>
      {/* Header  */}
      <header className='col-span-2 row-span-3 lg:row-span-2'>
        {/* <!-- Navigation bar --> */}
        <nav
          className="relative flex w-full items-center justify-between py-2 text-neutral-600 shadow-lg hover:text-neutral-700 focus:text-neutral-700 bg-neutral-600 text-neutral-200 md:flex-wrap md:justify-start"
          data-te-navbar-ref>
          <div className="flex w-full flex-wrap items-center justify-between px-3">

            {/* <!-- Navigation links --> */}
            <div
              className="flex grow basis-[100%] items-center lg:basis-auto"
              id="navbarSupportedContentY"
              data-te-collapse-item>
              <ul
                className="mr-auto flex items-center"
                data-te-navbar-nav-ref>
                {
                  (auth.rol === "ADMINISTRATOR" || auth.rol === 'COMMUNITY') && (
                    <li className="pr-2" data-te-nav-item-ref key="approved">
                      <p
                        className="
                        block transition duration-150 ease-in-out flex gap-2 items-center text-white relative
                        disabled:text-black/30 hover:text-cs-blue p-2 [&.active]:text-black/90 hover:cursor-pointer"
                        data-te-nav-link-ref
                        data-te-ripple-init
                        data-te-ripple-color="light"
                        onClick={() => setModal({ type: 'pending' })}
                      >
                        <MdSpeakerNotesOff />
                        Pending
                        <div className="text-sm w-6 h-6 rounded-full absolute -top-1 -right-1 bg-red-500 text-white text-center">
                          {data}
                        </div>
                      </p>
                    </li>
                  )
                }
                {
                  links.map(link => (
                    <li className="pr-2" data-te-nav-item-ref key={link.text}>
                      <p
                        className="
                    block transition duration-150 ease-in-out flex gap-2 items-center text-white
                    disabled:text-black/30 hover:text-cs-blue p-2 [&.active]:text-black/90 hover:cursor-pointer"
                        data-te-nav-link-ref
                        data-te-ripple-init
                        data-te-ripple-color="light"
                        onClick={() => { link.action ? link?.action() : navigate(link.link) }}
                      >
                        {link.Icon}
                        {link.text}
                      </p>
                    </li>
                  ))
                }

              </ul>
            </div>
          </div>
        </nav>

        {/* <!-- Hero section with heading, subheading and button --> */}
        <div
          className="bg-cs-purple flex flex-col h-full gap-4 px-6 text-center text-neutral-200 lg:flex-row lg:pt-4 lg:justify-center lg:h-[65%] xl:h-full">
          <h1 className="text-3xl md:text-4xl font-bold mt-2 lg:mt-0">Blog Services</h1>
          <h3 className="text-cs-blue text-xl md:text-2xl font-bold">{setDescriptionName()}</h3>

        </div>
      </header>

      {/* SideMenu */}
      <div className='
          bg-cs-gray col-span-2 flex items-center justify-center text-4xl 
          md:text-6xl sm:gap-2
          lg:col-span-1 lg:flex-col lg:items-start lg:justify-start lg:gap-2 lg:pt-8 lg:row-[span_8_/_span_8]
        '
      >
        <Icon Icon={<FaHome />} text='Main' url="/intranet/main" isSide />
        {
          (auth.rol !== 'LAWYER' && auth.rol !== 'CLIENT') && (
            <>
              <Icon Icon={<FaBook />} text="Accounting" url={setUrl('url')} errorMsg={setUrl('errorMsg')} isSide />
              <Icon Icon={<GrNotes />} text="Blog" url="/intranet/blog" isSide />

            </>
          )
        }
        <Icon Icon={<FaUsers />} text="Clients" url='/intranet/clients' isSide />
        {
          auth.rol === 'ADMINISTRATOR' && <Icon Icon={<FaUsersCog />} text="Users" url="/intranet/users" isSide />
        }

      </div>

      {/* Principal Component */}
      <div className='row-span-6 overflow-auto text-black lg:row-[span_8_/_span_8] bg-white relative'>{<Component />}</div>
    </div>
  )
}

export default Layout