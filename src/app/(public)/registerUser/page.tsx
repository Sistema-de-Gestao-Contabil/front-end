'use client';
import { useState } from 'react';
import Input from "@/components/Input";
import Button from "@/components/Button";
import Image from "next/image";


import imgLogin from "@/assets/Croods Chart.png";


export default function RegisterUser() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')


    const handleSignupForm = async (event: any) => {
        event.preventDefault()
        console.log({ email, password, confirmPassword })

    }

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
                    <h1 className="mb-10 font-bold text-lg flex items-center justify-center text-[#707290]">Cadastro de Usuário</h1>
                    <form className="flex flex-col w-full p-4 max-w-[600px]">

                        <label htmlFor="email" className="text-[#444557]">Email</label>
                        <Input
                            className="pl-6 mb-9 w-full"
                            placeholder="email@exemple.com"
                            type="text"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />

                        <label htmlFor="password" className="text-[#444557]">Senha</label>
                        <Input
                            className="pl-3 mb-9 w-full"
                            placeholder="Informe uma senha"
                            type="text"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />

                        <label htmlFor="password" className="text-[#444557]">Confirmar Senha</label>
                        <Input
                            className="pl-3 mb-9 w-full"
                            placeholder="Confirme a senha"
                            type="text"
                            value={confirmPassword}
                            onChange={(event) => setconfirmPassword(event.target.value)}
                        />

                        <Button className="m-auto w-full" type='submit'>Confirmar Cadastro</Button>

                        <p className="mt-10 text-center text-sm text-[#9A9AA2]">
                            Já tem uma conta?{' '}
                            <a href="/loginUser" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 text-[#6174EE]">
                                Faça o login
                            </a>
                        </p>

                    </form>
                </div>
            </div>
        </>
    )
}
