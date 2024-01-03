'use client';
import { useEffect, useState } from 'react';
import Input from "@/components/Input";
import Button from "@/components/Button";
import Image from "next/image";
import { useApi } from '@/hooks/useApi';

import imgLogin from "@/assets/Croods Chart.png";
// import { Post } from '@nestjs/common';
// import { response, Response } from 'express';
import Select from '../../../components/Select/index';


export default function RegisterCompany() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [sectores, setSectores] = useState([])
    const [sectorId, setSectorId] = useState<number>()
  


    async function newCompany() {
        console.log(sectorId)
        const response = await useApi('post', 'company', {
            name,
            email,
            address,
            phone,
           sectorId:Number(sectorId),
            
        }).then((response) => {
            console.log(response)

        })
       
        //@ts-ignore
        if(response){
            alert('Empresa cadastrada com Sucesso!')
            
        }
        

    }


    async function findAllSector() {
       const response = await useApi('get', 'sector')
       setSectores(response)
    }

    useEffect(() => {findAllSector()},[])



    // const handleSignupForm = (event: any) => {
    //     event.preventDefault()
    //     console.log({ nome, email, address, cashBalance, phone, password, confirmPassword })


    return (
        <>
            <div style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>

                <div className="w-1/2 mt-10 items-center justify-center">
                    <Image
                        priority
                        src={imgLogin}
                        alt="Follow us on Twitter"
                        width={450}
                        height={450}
                    />

                    <h1 className="w-[65%]  font-bold flex items-center justify-center text-[#707290]">Acompanhe o controle financeiro da sua empresa</h1>
                    <p className="w-[65%]  flex items-center justify-center text-[#9A9AA1]">gerencie suas receitas e despesas</p>
                </div>

                <div className="w-1/3 mt-10" >
                    <h1 className="mb-10 font-bold text-lg flex items-center justify-center text-[#707290]">Cadastre sua Empresa</h1>
                    <form className="flex flex-col w-full p-4 max-w-[600px]">

                        <label htmlFor="nome" className="text-[#444557]">Nome</label>
                        <Input
                            className="pl-6 mb-9 w-full"
                            placeholder="Nome da sua empresa"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />

                        <label htmlFor="email" className="text-[#444557]">Email</label>
                        <Input
                            className="pl-6 mb-9 w-full"
                            placeholder="email@exemple.com"
                            type="text"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />

                        <label htmlFor="address" className="text-[#444557]">Endereço</label>
                        <Input
                            className="pl-6 mb-9 w-full"
                            placeholder="Informe o endereço"
                            type="text"
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                        />

                        <label htmlFor="phone" className="text-[#444557]">Telefone</label>
                        <Input
                            className="pl-6 mb-9 w-full"
                            placeholder="Informe o telefone"
                            type="number"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                        />

                        <select  className="pl-6 mb-9 w-full h-10 w-96 bg-[#F5F5FE] rounded-xl border-none ring-1 ring-gray-100 focus:ring-gray-600" 
                        onClick={(event:any) => setSectorId(event.target.value)}>
                            {
                                sectores.map((sector:any) => 
                                <option value={sector.id}>{sector.name}</option>
                                )
                            }

                        </select>

                        <Button className="m-auto w-full" type='button' onClick={newCompany}>Confirmar Cadastro</Button>

                    </form>
                </div>
            </div>
        </>
    )
}
