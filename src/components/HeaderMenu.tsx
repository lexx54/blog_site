
import Logo from '../assets/Logo_white.png'
import { IoMenu } from "react-icons/io5";
import { useDeviceSize } from '../hooks/Responsive';
import { useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslationKeys } from '../language/type-i18n';
import spanishIcon from '../assets/castellano.png';
import catalaIcon from '../assets/catala.png'
import inglesIcon from '../assets/ingles.png'
import { useNavigate } from 'react-router-dom';


type TOptions = {
  action?: any
  [idx: string]: string
}

const LanguageSelector = () => {
  const { i18n } = useTranslation<TranslationKeys>();
  const [options, setOptions] = useState<TOptions[]>([
    { value: 'ca', label: 'Catalán', image: catalaIcon },
    { value: 'es', label: 'Español', image: spanishIcon },
    { value: 'en', label: 'English', image: inglesIcon },
  ])

    const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng).catch((error) => {
          console.error('Error al cambiar el idioma:', error);
      });
    }
    const getStyle = (id: number) => {
      if (id === 0) return 'z-1 absolute left-0 top-0 opacity-50'
      if (id === 1) return 'z-10 absolute left-4 top-2'
      if (id === 2) return 'z-1 absolute left-8 top-0 opacity-50'
    }

    const handleClick = (lng: string) => {
      setOptions(prev => {
        const currentLng = prev.find(opt => opt.value === lng) as any
        const optionWithoutLng = prev.filter(opt => opt.value !== lng)
        return [optionWithoutLng[0],     currentLng, optionWithoutLng[1]]

      })
      changeLanguage(lng)
    }
  return (

    <div className="relative flex gap-2 w-[10%] self-start">
      {
        options.map((opt, idx) => (
          <div className={`${getStyle(idx)} flex h-6 w-6 items-center justify-center rounded-full text-white transition-all hover:translate-y-1`} onClick={() => handleClick(opt.value)}>
            <img src={opt.image} alt="" key={opt.value}  className="w-full h-full"/>
          </div>
        ))
      }

  </div>
  );
};

const HeaderMenu = ({ refs  }: { refs?: any}) => {
  const { t } = useTranslation<TranslationKeys>();
  const navigate = useNavigate()
  const { isDesktop } = useDeviceSize()
  const [isOpen, toggleIsOpen] = useReducer((prev) => !prev, false);
  const auth = localStorage.getItem('auth_token')


  const handleClick = (option: any) => {
    if (option.action !== undefined) {
      navigate('/')
      option.action()
    }
    else navigate(option.link)
  }

  const links = [
    {
      text: t('footer.newsletter.links.1' as TranslationKeys),
      link: '/#Us',
      action: () => refs.current[0].scrollIntoView({ behavior: 'smooth' })
    },
    {
      text: t('footer.newsletter.links.2' as TranslationKeys),
      link: '/#Actions',
      action: () => refs.current[1].scrollIntoView({ behavior: 'smooth' })
    },
    {
      text: t('footer.newsletter.links.3' as TranslationKeys),
      link: '/#Services',
      action: () => refs.current[2].scrollIntoView({ behavior: 'smooth' })

    },
    {
      text: t('footer.newsletter.links.4' as TranslationKeys),
      link: '/#Contact',
      action: () => refs.current[3].scrollIntoView({ behavior: 'smooth' })
    },
    {
      text: t('footer.newsletter.links.5' as TranslationKeys),
      link: '/blog'
    },
    {
      text: 'Login',
      link: '/intranet/login'
    },
  ]

  //
  useEffect(() => {
    const keyFunction = (e: KeyboardEvent) => {
      if (e.key === 'l' && e.ctrlKey) {
        auth ? navigate('/intranet/main') : navigate('/intranet/login')
      }
    }

    document.addEventListener('keydown', keyFunction)

    return () => document.removeEventListener('keydown', keyFunction)
  }, [])

    return (
      <div className='w-full h-[150px] bg-cs-purple flex justify-between items-center px-8 pt-12 pb-2 z-50 lg:px-20 lg:pt-[24px] xl:px-32'>
        <div className='h-full'>
            <img src={Logo} style={{ height: '100%'}}/>
        </div>
        {
          isDesktop && (
            <div className='flex gap-4 justify-around basis-2/3 text-white text-[18px] lg:basis-4/6 items-center text-center'>
            {
              links.map(link => (
                <p onClick={() => handleClick(link)} className='hover:drop-shadow-[2px_2px_1px_rgba(0,_168,_232,_1)]'>
                  {link.text}
                </p>
              ))
            }
          <LanguageSelector />
          </div>
          )
        }
        {
          !isDesktop && (
            <div className="relative">
      <button
        className="text-gray-800 hover:text-gray-900 focus:outline-none focus:text-gray-900"
        onClick={toggleIsOpen}
      >
        <IoMenu className="text-5xl text-white md:text-6xl" />
      </button>
      {isOpen && (
        <div className="absolute z-10 right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg">
          {
            links.map(link => (
              <p
              onClick={() => {handleClick(link); toggleIsOpen()}}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              {link.text}
            </p>
            ))
          }
        </div>
      )}
    </div>
          )
        }

    </div>
  )
}

export default HeaderMenu