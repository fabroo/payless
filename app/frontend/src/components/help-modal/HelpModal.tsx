import React from 'react'
import ReactModal from 'react-modal'
import { X } from 'phosphor-react'
import cafecito_logo from '../../assets/cafecito_logo.png'

export default function HelpModal(props:any) {

    return (
        <div>
            <ReactModal
                closeTimeoutMS={500}
                isOpen={props.isOpen}
                onRequestClose={() => props.setOpen(false)}
                
                ariaHideApp={false}
                className="modalContainer"
                shouldCloseOnOverlayClick={true}
            >
                <div className="flex flex-col p-4 text-whiteish">
                    <button onClick={()=>props.setOpen(false)} className="flex flex-row justify-end">
                        <X size={30}></X>
                    </button>
                    <span className='text-sm px-2 mb-2 font-base'>
                        “A Donde Vamos” es una página que combina 4 de las aplicaciones de viajes usadas en la Argentina para poder visualizar los precios que te ofrece cada una para el mismo viaje, y asi poder tomar una decisión rápida e informada.
                        <br/>
                        <br/>
                        Teniendo en cuenta que algunas Aplicaciones también toman valores de cada cuenta en específico, los precios pueden fluctuar levemente.
                    </span>
                    <button className='flex flex-row self-center w-full p-2 mt-2 rounded-xl bg-ocean-blue-700'>
                        <img src={cafecito_logo} alt="" />
                        <span className='pl-2 text-left text-sm leading-tight'>Te sirvio esta página?<br/>Considerá comprarnos un <span className='text-light-pink'>Cafecito</span></span>
                    </button>
                    
                </div>
            </ReactModal>
        </div>
    )
}
