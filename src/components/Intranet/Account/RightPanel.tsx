import { useEffect } from 'react'
import { TClient } from '../../../types/client'
import { FaIdCard, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'
import PaymentItem from './PaymentItem'
import { useAppStore } from '../../../store'
import { TAccountEvent } from '../../../store/eventsStore'
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5'
import { MdOutlinePayments } from 'react-icons/md'
import { toast } from 'react-toastify'
import useClients from '../../../hooks/useClients'


type TProps = {
    side: boolean
    data: TClient | undefined
}



const RightPanel = ({ side, data }: TProps) => {
  const {update} = useClients('all')
  const  { event: { account }, addAccountEvent, clearAccounts, setModal, deleteAccountById } = useAppStore()
  const totalPaid = account.reduce((total, prev) => total += Number(prev.amount), 0)
  const isPaymentCompleted = (totalPaid === data?.price && totalPaid !== 0)

/* In this case, the `useEffect` hook is used to clear the `account` state and add new account events based on the `data` prop. */
  useEffect(() => {
    
    const dues = JSON.parse(String(data?.dues)) ?? null ;
    
    if (dues !== null && account.length <= 0)  {
      clearAccounts()
      dues.forEach((due: TAccountEvent)=> {
        addAccountEvent(due)
      });
    }

  }, [])

  const handleDelete = (id:number) => {
    const filteredAccount = account.filter(item => item.id !== id)
    update.mutate({ data: { dues: JSON.stringify(filteredAccount) }, id: Number(data?.id) }, {
      onSuccess() {
        // addAccountEvent(eventToAdd)
        deleteAccountById(id)
        toast.success('Payment Deleted')
      },
      onError() {
        toast.error("Payment could'nt be deleted")
      },
    })
  }

  return (
    <div className={`
    bg-white h-full ${side ? 'flex-0 w-0 z-1' : 'flex-1 w-full z-10'} transition-all  duration-300 ease-in flex flex-col
    lg:basis-1/4 lg:w-full
    `}>
      <div className='border m-2 rounded shadow pb-2'>
        <p className='text-end uppercase mb-2 bg-cs-blue '>Accounting</p>
        <p className='mx-4'>{account.length} payments has been done</p>
        <p className='mx-4'>Price {data?.priceQuote}€</p>
        <p className='mx-4'>money owed {Number(data?.price) - totalPaid}€</p>
        {
          isPaymentCompleted && <div className='flex justify-center'>
            <p className='
              bg-cs-purple w-full m-2 py-2 rounded text-center text-white transiton-all
              hover:cursor-pointer hover:-translate-x-px hover:-translate-y-px hover:bg-cs-purple-light
            '
              onClick={() => setModal({ type: 'closeProcedure',  id: data.id })}
            >
              Payment completed
            </p>
          </div>
        }
      </div>
      <div className='basis-1/2 border m-2 rounded shadow overflow-auto flex flex flex-col gap-2'>
        <p className='bg-cs-blue md:text-2xl lg:text-3xl uppercase inline-flex gap-2 justify-end items-center'>
          Payments
          {
          isPaymentCompleted && <IoCheckmarkDoneCircleOutline onClick={() => setModal({ type: 'closeProcedure',  id: data.id }) } className="hover:cursor-pointer" />
        }
        </p>
        {
          (account.length <= 0 && data?.price === 0)  && (
            <>
            <p className='text-center my-4'>Actualmente no posee tramite con este cliente</p>
          <div className='
            w-[80%] self-center p-2 rounded shadow shadow-cs-purple/50 text-center
            hover:-translate-x-2 hover:-translate-y-2 transition-all hover:bg-cs-purple hover:text-white
            '
            onClick={() => setModal({ type: 'addProcedure', id: Number(data?.id)})}
            >
            <p>Manage a procedure</p>
          </div>
              </>
          )
        }
        {
          (account.length <= 0 && data?.price !== 0) && (
            <div className='flex flex-col items-center mt-2 mx-2 text-center'>
            <p>Make the first payment, clicking in the payment day on the calendar</p>
            <p><MdOutlinePayments  className="text-2xl" /></p>
            </div>
          )
        }
        <div></div>
        {
          account.length >= 1 && (
            <div className='grid grid-cols-2 gap-2 px-2 md:grid-cols-3 lg:grid-cols-2'>
              {
                account.map(item => <PaymentItem day={item.start} price={item.amount} handleDelete={() => handleDelete(Number(item.id))} key={String(item.id)} />)
              }
            </div>
          ) 
        }
      </div>
      <div className='border m-2 rounded shadow px-4 py-2'>
        <div className='flex items-center gap-2 font-bold'>
          <FaIdCard />
          <p>
            client:
            {' '}
            <span className='font-normal'>
              {data?.name}
            </span>
          </p>
        </div>
        <div className='flex items-center gap-2 font-bold'>
          <FaPhoneAlt />
          <p>
            Phone:
            {' '}
            <span className='font-normal'>
              {data?.mainPhone}
            </span>
          </p>
        </div>
        <div className='flex items-center gap-2 font-bold'>
          <FaMapMarkerAlt />
          <p>
            Address:
            {' '}
            <span className='font-normal'>
              {data?.address}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RightPanel