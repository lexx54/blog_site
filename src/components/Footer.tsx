import { IoMdSend } from "react-icons/io";
import { FaFacebookF } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import Logo from '../assets/Logo_white.png';
import { useState } from "react";
import axios from "axios";
import { useDeviceSize } from "../hooks/Responsive";
import { TranslationKeys } from "../language/type-i18n";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type TOptions = {
  url: string;
  text: string;
  action?: any;
}

const icons = [
  {
    // url: "https://www.facebook.com/XilcatGestion?paipv=0&eav=AfYUgBvP-TzhlDG0yrVeq890HiiRwf4XktncOhOJxi64_yqtQhRtFDmH53cBiogKJac&_rdr",
    icon: <FaFacebookF />
  },
  {
    // url: "https://www.instagram.com/xilcat_gestion?igshid=YmMyMTA2M2Y%3D",
    icon: <RiInstagramFill />
  },
  // {
  //   url: "",
  //   icon: <FaTwitter />
  // },
  // {
  //   url: "",
  //   icon: <FaYoutube />
  // },
]

const Footer = ({ refs }: { refs?: any }) => {
  const navigate = useNavigate()
  const { t } = useTranslation<TranslationKeys>();
  const { isDesktop } = useDeviceSize()
  const [email, setEmail] = useState('')

  const handleClick = (option: TOptions) => {
    if (option.action !== undefined) {
      navigate('/')
      option.action()
    }
    else navigate(option.url)
  }


  const options: TOptions[] = [
    {
      url: '',
      text: t('footer.newsletter.links.1' as TranslationKeys),
      action: () => refs.current[0].scrollIntoView({ behavior: 'smooth' })
    },
    {
      url: '',
      text: t('footer.newsletter.links.2' as TranslationKeys),
      action: () => refs.current[1].scrollIntoView({ behavior: 'smooth' })
    },
    {
      url: '',
      text: t('footer.newsletter.links.3' as TranslationKeys),
      action: () => refs.current[2].scrollIntoView({ behavior: 'smooth' })
    },
    {
      url: '',
      text: t('footer.newsletter.links.4' as TranslationKeys),
      action: () => refs.current[4].scrollIntoView({ behavior: 'smooth' })

    },
    {
      url: '/blog',
      text: t('footer.newsletter.links.5' as TranslationKeys),
    }
  ]

  const handleSubmit = async () => {
    toast.success("Subcription added")

    setEmail('')
  }
  return (
    <div className="bg-cs-gray w-full min-h-[30vh] mt-12 flex flex-col items-center justify-center lg:flex-row lg:justify-evenly lg:items-start lg:px-12 lg:pt-20">
      <div className="flex flex-col items-center mb-14 lg:items-start">
        <img src={Logo} className="mt-12 w-32 lg:mt-0" />
        <p className="text-center mb-8 w-[70%] text-white text-sm md:text-[18px] lg:text-[17px] lg:text-start">{t('footer.description' as TranslationKeys)}</p>
        <div className="flex w-[70%] justify-center text-2xl text-white lg:justify-start">
          {
            icons.map((icon, idx) => (
              <div className={`${idx !== icons.length - 1 ? "border-r-2 border-white" : ''} ${idx === 0 ? "lg:pl-0" : ''} px-6 text-[16px] md:text-[30px] md:px-10 lg:text-[19px]`}>
                <a href={icon.url} target="_blank" rel="noopener noreferrer" className="hover:text-cs-purple-light transition-all">
                  {icon.icon}
                </a>
              </div>
            ))
          }
        </div>
      </div>
      <div className="text-center text-white mt-12 mb-20 w-[70%] md:w-[50%] flex flex-col items-center justify-center lg:justify-start lg:order-3 lg:gap-6 lg:basis-1/3 lg:mx-4 lg:items-start lg:text-start lg:my-0 ">
        <p className="text-bold text-[22px] md:text-[25px]">{t('footer.newsletter.title' as TranslationKeys)}</p>
        <p className="my-4 text-sm md:text-[18px] lg:text-[16px] lg:my-0">{t('footer.newsletter.description' as TranslationKeys)}</p>
        <div className="relative flex items-center justify-center w-full">
          <input
            type="text"
            className="pl-4 pr-2 py-2 rounded-md border-gray-300 text-red-500 focus:ring-blue-500 focus:border-blue-500 w-full placeholder:text-gray-400 md:py-3 md:text-[20px]"
            placeholder={t('footer.newsletter.placeholder' as TranslationKeys)}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="absolute right-1 top-1 bg-[#2C2949] text-white p-2 rounded cursor-pointer md:p-3 md:text-2xl" onClick={handleSubmit}>
            <IoMdSend className="" />
          </div>
        </div>
      </div>

      <div className="text-xs text-white flex items-center justify-between gap-4 mb-20 md:text-[19px] md:gap-12 lg:flex-col lg:order-2 lg:justify-around lg:mb-0 lg:gap-4 lg:items-start">
        {
          isDesktop && <p className="text-[25px] xl:text-[29px] leading-tight ">LINK DE INTERESES</p>
        }
        {
          options.map(option => (
            <p onClick={() => handleClick(option)} className="border-b hover:text-gray-200 pb-1 lg:border-none hover:drop-shadow-[2px_2px_1px_rgba(0,_168,_232,_1)]">{option.text}</p>
          ))
        }
      </div>
    </div>
  )
}

export default Footer