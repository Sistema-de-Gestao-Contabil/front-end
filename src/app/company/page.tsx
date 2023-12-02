'use client';
import { useState } from 'react';
import styles from '@/app/company/company.module.css';


export default function Company() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignupForm = (event:any)  => {
        event.preventDefault()
        console.log({name, email, password})
      
    }
    return (
    
        <div className={styles.container}>
            <div className={styles.div1}>
                <h1 className={styles.h1}>Acompanhe o controle financeiro da sua empresa</h1>
                <p className={styles.p}>gerencie suas receitas e despesas</p>
            </div>

                <div className={styles.div2}>
                    <h1 className={styles.h1}>Cadastre sua Empresa</h1>
                    <form className={styles.form} onSubmit={handleSignupForm}>
                        <label>Nome da Empresa</label>
                        <input 
                            className={styles.input}
                            type='text'
                            placeholder='Nome da Empresa' 
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required 
                         />

                        <label>Email</label>
                        <input 
                            className={styles.input}
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required 
                          />

                        <label>Senha</label>
                        <input 
                            className={styles.input}
                            type="password"
                            placeholder='Senha'
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required 
                          />

                        <label>Confirmar Senha</label>
                        <input 
                            className={styles.input}
                            type="password"
                            placeholder="Confirmar Senha"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                           />

                        <button className={styles.submit} type='submit'> Próximo </button>
                    </form>
                   
                </div>

                
        </div>

    )
}
