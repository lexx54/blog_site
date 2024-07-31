import AboutUs from '../../components/Landing/AboutUs'
import Services from '../../components/Landing/Services'
import Offer from '../../components/Landing/Offer'
import OurTeam from '../../components/Landing/OurTeam'
import Contact from '../../components/Landing/Contact'
import Footer from '../../components/Footer'
import HeaderMenu from '../../components/HeaderMenu'
import Intro from '../../components/Landing/Intro'
import { useRef } from 'react'

const Landing = () => {
  const multipleRef = useRef<Array<HTMLInputElement | null>>([])
  const setRef = (id: number) => (el: HTMLInputElement) => multipleRef.current[id] = el;

  return (
    <>
      <HeaderMenu refs={multipleRef} />
      <div className='flex flex-col scroll-smooth text-cs-purple'>
        <Intro contactRef={multipleRef} />
        <AboutUs setRef={setRef} refs={multipleRef} />
        <Services setRef={setRef} contactRef={multipleRef} />
        <Offer setRef={setRef} />
        <OurTeam setRef={setRef} />
        <Contact setRef={setRef} />
      </div>
      <Footer refs={multipleRef} />
    </>
  )
}

export default Landing