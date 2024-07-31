import { useState } from 'react'
import { useAppStore } from '../../store'
import moment from 'moment'
import { toast } from 'react-toastify'
import  Select, { SingleValue }  from 'react-select'

import useClients from '../../hooks/useClients'
import Loader from '../Common/Loader'
import Error from '../Common/Error'
import usejournal from '../../hooks/useJournal'
import { TJournal } from '../../types/journal'

const Event = () => {
  const [isClientRegistered, setIsClientRegistered] = useState(true)
  const [amount, setAmount] = useState('0')
  const { list: { data, isLoading, isError}, update } = useClients('all')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const { addAccountEvent, addJournalEvent, modal, closeModal, event: { account } } = useAppStore()

  const { post } = usejournal()
  const startDate = moment(modal.params.start).toDate()

  const handleAddEvent = () => {
    if (modal.params.type === 'account'){
        if (amount === '0' || amount === '' || amount.includes('-')) return toast.error('No puedes poner un monto negativo o 0')
        const eventToAdd = {
          start: moment(modal.params.start),
          end: moment(modal.params.end),
          title: `he/she pays ${amount}€`,
          amount,
          id: Math.floor(Math.random() * 999999999999)
        }
        update.mutate({ data: { dues: JSON.stringify(account.concat(eventToAdd)) }, id: Number(modal.params.id) }, {
          onSuccess() {
            addAccountEvent(eventToAdd)
            toast.success('Payment added')
            closeModal()
          },
          onError() {
            toast.error("Payment couldn't be added")
            closeModal()
          },
        })
      
    } else {
      const dataToSend: TJournal = {
        start: moment(modal.params.start),
        end: moment(modal.params.end),
        title,
        description,
        auth: Number(modal.params.id)
      }
      post.mutate({ data: dataToSend }, {
        onSuccess: (data) => {
          addJournalEvent(data)
          toast.success('Note added')
          closeModal()
        },
        onError: (error) => {
          if (Array.isArray(error)) {
            error.forEach((e: any) => {
              toast.error(e)
            })
          } else toast.error(error)
        }
      })
    }
  }
  const handleChange = (
    newValue: SingleValue<{ label: string, value: string }>,
  ) => {
    setTitle(String(newValue?.value))
  }

  if (isLoading) return <Loader />

  if (isError) return <Error />

  return (
    <div className='flex flex-col gap-4'>
      <p className='font-semibold'>Date {startDate.getDate()}/{startDate.getMonth() + 1}/{startDate.getFullYear()}</p>
      {
        modal.params.type === 'account' && (
        <div className='flex gap-2 justify-evenly'>
          <label htmlFor="payment">Enter payment amount</label>
          <input type="number" id="payment" min={0} className='border' value={amount} onChange={(e) => setAmount(String(e.target.value))} />
        </div>
        )
      }
      {
        modal.params.type === 'journal' && (
          <div className='flex flex-col gap-4'>
            <div className='relative'>
              <p className='mb-4 flex justify-between items-center'>
                Select the client
                <span className={`${isClientRegistered ? 'bg-green-300 hover:bg-green-500': 'bg-red-300 hover:bg-red-500'} transition-all px-2 py-1 rounded hover:cursor-pointer`} onClick={() => setIsClientRegistered(prev => !prev)}>
                  {isClientRegistered ? 'Registrado': 'No Registrado'}
                  </span>
              </p>
              {
                isClientRegistered && (
                  <Select
                    options={data?.map(item => ({ label: item.name, value: item.name }))}
                    onChange={handleChange}
                  />
                )
              }
               {
                !isClientRegistered && (
                  <div className="border relative">
                  <label htmlFor="" className="absolute top-2 left-2">Nombre</label>
                  <input  className="w-full py-2 pr-2 pl-20" onChange={(e) => setTitle(e.target.value)}/>
                  {/* <input  className="w-full py-2 pr-2 pl-32" {...register('contact')} maxLength={9}/> */}
                </div>
                )
               }
            </div>
            <div className='relative'>
              <label className='absolute top-0 left-4 right-4 border-b border-b-cs-purple py-2 px-4 text-center'>Description</label>
              <textarea id="payment" className='border w-full min-h-[200px] pt-12 px-2' value={description} onChange={(e) => setDescription(String(e.target.value))} />
            </div>
          </div>
        )
      }
      <button onClick={handleAddEvent} className='bg-cs-purple py-2 rounded-md text-white transition-all hover:cursor-pointer hover:bg-cs-purple-light hover:-translate-y-1 shadow-lg'>Add</button>
    </div>
  )
}

export default Event