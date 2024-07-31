/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaArchive, FaEdit, FaIdCard, FaMailBulk, FaMapMarkerAlt, FaPhoneAlt, FaTrash } from 'react-icons/fa'
import { FaDeleteLeft } from "react-icons/fa6";
import { TClient } from '../../../types/client'
import useClients from '../../../hooks/useClients'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../../store'
import { useEffect, useReducer, useState } from 'react'
import InputItem from './InputItem';
import Button from './Button';
import { MdOnlinePrediction } from 'react-icons/md';

type TProps = {
    data: TClient | undefined
    side: boolean
}

export type TClientServer = Pick<TClient, 'name' | 'address' | 'email' | 'mainPhone' | 'secondaryPhone' | 'category'>

const LeftPanel = ({ data, side }:TProps) => {
  const [isEditing, toggleIsEditing] = useReducer((prev) => !prev,false)
  const [userData, setUserData] = useState<TClientServer>({
    name: '',
    email: '',
    address: '',
    mainPhone: '',
    secondaryPhone: '',
    category: ''
  })
  const { erase, update } = useClients('all')
  const { setModal } = useAppStore()
  const navigate = useNavigate()
  
  const handleClick = () => {
    erase.mutate(Number(data?.id))
    navigate('/intranet/clients')
    toast.success('Client deleted succesfully')
  }

  const handleUpdateData = () => {
    update.mutate({ data: userData, id: Number(data?.id)}, {
      onSuccess: () => {
        toast.success('Client data has been edited succesfully')
        toggleIsEditing()
      }
    })
  }

  const handleToggleClientCategory = () => {
    update.mutate({ data: { category: data?.category === 'active' ? 'archived': 'active'}, id: Number(data?.id)}, {
      onSuccess() {
        toast.success('Client has beed ' + data?.category === 'active' ? 'archived': 'activated' + ' succesfully.')
        navigate('/intranet/clients')
      }
    })
  }
  const checkNullity = (prop: any) => {
    if (prop === null || prop === 'null') return 'N/A'
  }

  useEffect(() => {
    if (isEditing) {
      setUserData({
        name: String(data?.name),
        email: String(data?.email),
        address: String(data?.address),
        mainPhone: String(data?.mainPhone),
        secondaryPhone: String(data?.secondaryPhone),
        category: String(data?.category)
      })
    } else {
      setUserData({
        name: '',
        email: '',
        address: '',
        mainPhone: '',
        secondaryPhone: '',
        category: ''
      })
    }
  }, [isEditing])
  return (
    <div className={`
    border my-2 mx-4 shadow relative
    bg-white h-full ${side ? 'flex-1 w-full opacity-100' : 'flex-0 w-0 opacity-0'} transition-all duration-300 ease-in flex flex-col
    lg:flex-1 lg:w-[30%] lg:opacity-100
    `}>
            <button className='absolute top-4 right-4 w-4 h-4 bg-red hover:text-red-500 transition-all' onClick={handleClick}>
              <FaTrash />
            </button>
            <button className='absolute top-4 right-12 w-4 h-4 bg-red hover:text-red-500 transition-all' onClick={toggleIsEditing}>
              {isEditing ? <FaDeleteLeft /> :<FaEdit />}
            </button>
            <button className='absolute top-4 right-20 w-4 h-4 bg-red hover:text-red-500 transition-all' onClick={handleToggleClientCategory}>
              {data?.category === 'active' ? <FaArchive /> : <MdOnlinePrediction />}
            </button>
      <div className='text-center flex flex-col gap-2 mt-4'>
        <h1>Procedure requested by {data?.auth?.username}</h1>
        <p className='font-semibold md:text-xl lg:text-3xl'>Client file {data?.name.split(' ')[0]}</p>
      </div>
      <div className='
        flex-1 flex flex-col gap-2 py-4 px-8 mt-2 
        md:mt-4 md:gap-4
        lg:mt-8
        xl:gap-6'>
          <InputItem isEditing={isEditing} value={ isEditing ? String(userData?.name) : String(data?.name)} type='name' icon={<FaIdCard />} setValue={setUserData}/>
          <InputItem isEditing={isEditing} value={ isEditing ? String(userData?.email) : String(data?.email)} type='email' icon={<FaMailBulk />} setValue={setUserData}/>
          <InputItem isEditing={isEditing} value={ isEditing ? String(userData?.address) : String(data?.address)} type='address' icon={<FaMapMarkerAlt />} setValue={setUserData}/>
          <InputItem isEditing={isEditing} value={ isEditing ? String(userData?.mainPhone) : String(data?.mainPhone)} type='mainPhone' icon={<FaPhoneAlt />} setValue={setUserData}/>
          <InputItem isEditing={isEditing} value={ isEditing ? String(userData?.secondaryPhone) : String(checkNullity(data?.secondaryPhone))} type='secondaryPhone' icon={<FaPhoneAlt />} setValue={setUserData}/>
      </div>
        {
          (data?.tramiteType !== 'TYPE1' && !isEditing) && (
            <Button>
              <p className='font-semibold md:text-xl lg:text-2xl'>
                Procedure to be done:
                {' '}
                <span className='font-normal text-cs-blue'>{data?.tramiteType}</span>
                </p>
                <p className='font-semibold md:text-xl lg:text-2xl'>
                  Procedure price
                  {' '}
                <span className='font-normal text-cs-blue'>{data?.priceQuote} €</span>
                </p>
            </Button>
          )
        }
        {
          (data?.tramiteType === 'TYPE1' && !isEditing) && (
              <Button  onClick={() => setModal({ type: 'addProcedure', id: Number(data.id)})}>
                <p>Manage a procedure</p>
              </Button>
          )
        }
        {
          isEditing && (
            <Button  onClick={handleUpdateData}>
              <p>Save</p>
          </Button>
          )
        }


    </div>
  )
}

export default LeftPanel