import React, { useState } from 'react';
import Card from '../../components/Blog/Card';
import HeaderMenu from '../../components/HeaderMenu';
import Footer from '../../components/Footer';
import useBlog from '../../hooks/useBlog';
import Logo from '../../assets/Logo_white.png'
import Loader from '../../components/Common/Loader';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa';
import { useAppStore } from '../../store';
import Carousel from './Carousel';
import { ArticleCategory } from './types';
import { categoryNames } from './Constants';



const BlogPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState<ArticleCategory>('ALL')
  const [currentCategory, setCurrentCategory] = useState<ArticleCategory>('ALL')
  const { list } = useBlog({ page, limit: 10, category, showApproved: 'true' })
  const { setModal } = useAppStore()

  const handleCategorySelection = (categoryServer: ArticleCategory) => {
    setCurrentCategory(categoryServer)
    setCategory(categoryServer)
  }

  if (list.isLoading) return (
    <>
      <HeaderMenu />
      <div className='flex items-center justify-center h-[50vh] mt-12'>
        <Loader />
      </div>
      <Footer />
    </>
  )

  return (
    <>
      <HeaderMenu />
      <div className='flex justify-end mb-4'>

        <div className="
        text-4xl my-8 bg-cs-purple text-white px-2 uppercase relative rounded flex justify-end items-between
        md:text-end w-[60%]
        lg:text-6xl
        xl:items-end  xl:mb-0  xl:w-full xl:mx-12
        ">
          <p>
            Xilcat
            <span className='text-cs-blue ml-1'>
              {categoryNames[category]}
            </span>
          </p>
        </div>
      </div>
      <Carousel handleCategorySelection={handleCategorySelection} />
      <div className="relative container mx-auto py-4 min-h-[50vh] px-8 md:px-12 xl:grid xl:grid-cols-2 xl:gap-10 xl:place-items-center ">
        <button
          onClick={() => setModal({ type: 'blog', params: { type: 'no_registered' } })}
          className='
        fixed right-4 bottom-8 z-10 bg-cs-blue px-4 py-2 rounded text-white transition-all
        hover:-translate-y-1 hover:-translate-x-1 hover:shadow-lg hover:shadow-gray-800
        '>
          publicar
        </button>
        {
          (Number(list.data?.length) <= 0 && page === 1) && (
            <>
              <div className='flex items-center justify-center h-[50vh] mt-12 col-span-2'>
                <div className='border rounded-md shadow-lg h-full flex justify-center items-center mx-8 bg-cs-gray text-white'>
                  <div className='px-8'>
                    <p className='text-center font-bold text-3xl'>No blog has been added yet</p>
                    <div className='relative h-40 w-40 mx-auto mt-8'>
                      <img src={Logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        }
        {
          (Number(list.data?.length) >= 1) && (
            <>
              {list?.data?.map((article) => (
                <Card article={article} current={currentCategory} />
              ))}

            </>
          )
        }
      </div>
      <div className='flex justify-center items-center text-xl gap-2'>
        <button
          disabled={page <= 1}
          className={`${page <= 1 && 'text-gray-300 hover:cursor-not-allowed'}`}
          onClick={() => setPage(prev => prev - 1)}
        >
          <FaArrowAltCircleLeft />
        </button>
        <div>{page}</div>
        <button
          disabled={Number(list.data?.length) <= 10}
          className={`${Number(list.data?.length) <= 10 && 'text-gray-300 hover:cursor-not-allowed'}`}
          onClick={() => setPage(prev => prev + 1)}
        >
          <FaArrowAltCircleRight />
        </button>
      </div>
      <Footer />
    </>
  );
};

export default BlogPage;




