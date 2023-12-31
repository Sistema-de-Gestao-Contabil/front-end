'use client'
import React, { useEffect, useState } from "react";
import Heading from "@/components/Heading";
import Input from "@/components/Input";
import Select, { OptionProps } from "@/components/Select";
import Button from "@/components/Button";
import { useApi } from "@/hooks/useApi";
import { set, useForm } from "react-hook-form";
import SelectCategorys from "@/components/SelectCategorys";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import Alert from "@/components/Alert";
import Modal from "@/components/Modal";
import { endPoint } from "@/hooks/useApi";

//Schema que representa cada input do formulário
let createTransactionForm = z.object({
  value: z.number().nullable(),
    //.nonempty('O valor deve ser informado.'),
  description: z.string().nullish(),
    //.nonempty('A descrição deve ser informada.'),
  date: z.string()
    .nonempty('A data deve ser informada.'),
  type: z.string({ required_error: 'O tipo deve ser informado.' })
    .default("1"),
  status: z.string({ required_error: 'O status deve ser informado.' })
    .default("2")
})

type CreateTransactionData = z.infer<typeof createTransactionForm>

export default function Despesas() {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateTransactionData>({
    resolver: zodResolver(createTransactionForm)
  })
  const [companyId, setCompanyId] = useState<number>(0)
  const [categorys, setCategorys] = useState<object[]>([])
  const [showSelect, setShowSelect] = useState(false)
  const [categorySelected, setCategorySelected] = useState<object>()
  const [showInput, setShowInput] = useState(false)
  const [newNameCategory, setNewNameCategory] = useState()
  const [newTypeCategory, setNewTypeCategory] = useState(1)
  const [companys, setCompanys] = useState<object[]>([])
  const [alert, setAlert] = useState<string | null>();
  const [alertType, setAlertType] = useState<string | null>()
  const [isModalOpen, setIsModalOpen] = useState(false);


  const createTransaction = async (data: CreateTransactionData) => {
    //@ts-ignore
    if(categorySelected.name == 'Salário'){
      const response = await useApi('post', 'transactions', {
        date: data.date,
        type: 'despesa',
        status: 1,
        companyId: 1,
        //@ts-ignore
        categoryId: categorySelected.id
      })

      if(response.status == 201){
        showAlert('Transação realizada com sucesso.', 'success')
      }

      else{
        console.log(response);
        
      }
    }
    
    else{
      const response = await useApi('post', 'transactions', {
        value: Number(data.value),
        description: data.description,
        date: data.date,
        type: Number(data.type) == 1 ? 'receita' : 'despesa',
        status: data.status,
        companyId,
        //@ts-ignore
        categoryId: categorySelected.id
      })
  
      if(response.status == 201){
        showAlert('Transação realizada com sucesso.', 'success')
      }
    }


  }

  //função para listar as empresas
  const findAllCompanys = async () => {
    const response = await useApi('get', 'company')

    setCompanys(response)
    setCompanyId(response[0].id)
  }

  //função para listar as categorias
  const findAllCategorys = async () => {
    const response = await useApi('get', 'categorys')
    setCategorys(response.result)
  }

  //função para criação de uma nova categoria
  const createCategory = async () => {

    const response = await useApi('post', `categorys/${companyId}`, {
      name: newNameCategory,
      type: newTypeCategory == 1 ? 'receita' : 'despesa'
    })

    if (response.status == 200) {
      showAlert('Categoria criada com sucesso.', 'success')
    }

    setShowInput(!showInput)
    findAllCategorys()

  }

  const updateCategory = async (id:any, name:any) => {
    console.log(id);
    
    const response = await endPoint.request({
      method: 'patch',
      url: `categorys/?id=${id}&&companyId=1`,
      data: {name}
    })

    console.log(response);
    
    //@ts-ignore
    if(response.data.status == 200){
      showAlert('Categoria atualizada com sucesso.', 'success')
      setIsModalOpen(!isModalOpen)
      findAllCategorys()
    }
  }

  const deleteCategory = async (id:any) => {
    const response = await useApi('delete', `categorys/?id=${id}&&companyId=${1}`)
    
    if(confirm('Tem certeza que deseja remover essa categoria')){
      
      if(response.status == 200){
        showAlert('Categoria removida com sucesso.', 'success')
        findAllCategorys()
      }
    }


    else{
      //console.log(response);
      showAlert(response.response.data.message, 'error')
    }
  }

  useEffect(() => {
    findAllCategorys()
    findAllCompanys()
  }, [])

  const showAlert = (message: string, type: "success" | "error" | "warning") => {
    setAlert(message);
    setAlertType(type)
    // setTimeout(() => {
    //   setAlert(null);
    // }, 1550);
  };

  return (
    <>
      <Heading title="Transações" subtitle="Cadastro de despesas e receitas" />

      <div style={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>

        <form className="flex flex-col w-full p-4 max-w-[600px]">

          {/* Parte de input de categorias */}
          <label htmlFor="category" className="text-[#444557] mt-8">Categoria</label>
          <div className="w-full">
            <div
              className="h-10 pl-3 flex items-center bg-[#F5F5FE] text-[#444557] rounded-xl"
            >
              <div className="w-[90%] flex items-center" onClick={() => setShowSelect(!showSelect)}>
                <p className="w-[95%]">
                  {

                    /* @ts-ignore */
                    categorySelected?.name
                      ?
                      /* @ts-ignore */
                      categorySelected?.name
                      :
                      'Nenhuma categoria selecionada'

                  }
                </p>

                <Icon icon="ep:arrow-down-bold" width="12" height="12" />
              </div>


              <button type="button" className=" ml-3 bg-blue-600 h-10 flex justify-center items-center text-white w-10 rounded-md" onClick={() => { setShowInput(!showInput) }}>
                <Icon icon="typcn:plus" width="30" />
              </button>
            </div>

            <div style={showSelect ? {} : { display: 'none' }} className="max-h-[300px] overflow-y-scroll">

              {categorys.map((item: any) => 
                <div
                  className="flex items-center p-3 h-full bg-[#F5F5FE]  text-[#444557] hover:border-2 border-blue-600 hover:text-blue-600"
                  key={item.id}
                >

                  <div onClick={() => { setCategorySelected(item); setShowSelect(!showSelect); }} className="w-[75%]">
                    {item.name}
                  </div>

                  <div className="w-[25%] flex gap-3">

                    {
                      
                      item.company 
                      &&
                      <>
                        <button type="button" className="h-10 rounded-md text-white bg-blue-600 p-2 flex items-center hover:bg-blue-700" onClick={() => {
                          setIsModalOpen(!isModalOpen)
                          setCategorySelected(item); 
                          setShowSelect(!showSelect); 
                        }}>Editar</button>
                        <button 
                        type="button" 
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => deleteCategory(item.id)}
                        >Excluir</button>
                      </>
                    }
                  </div>
                </div>
                
              )}
            </div>

          </div>

          {
            showInput
              ?
              <div className=" mt-10 flex-col items-center rounded-xl border-2 border-blue-600 p-5">

                <div className="flex-col">
                  <div>
                    <label htmlFor="type" className="text-[#444557]">Nome</label>
                    <input type="text" className="bg-[#F5F5FE] outline-none w-full h-10 mb-3 rounded-xl pl-3 text-[#444557]" placeholder="Nome da nova categoria"
                      onChange={(e: any) => { setNewNameCategory(e.target.value) }} />
                  </div>

                  <div className="flex-col">
                    <label htmlFor="type" className="text-[#444557]">Tipo</label>
                    <Select
                      className="mb-3 h-10 rounded-xl bg-[#F5F5FE] w-full text-[#444557] pl-3"
                      options={[
                        {
                          id: 1,
                          name: 'Receita'
                        },
                        {
                          id: 2,
                          name: 'Despesa'
                        }
                      ]}
                      onChange={(e: any) => {
                        setNewTypeCategory(e.target.value)
                      }}
                    />
                  </div>

                  <div className="flex-col">
                    <label htmlFor="company" className="text-[#444557]">Empresa</label>

                    <select 
                    name="companys" 
                    className="mb-8 h-10 w-full pl-3 bg-[#F5F5FE] text-[#444557] rounded-xl border-none"
                    onChange={(e) => setCompanyId(Number(e.target.value))}
                    >
                      {
                        companys.map((company: any) => {
                          return <option key={company.id} value={company.id}>{company.name}</option>
                        })
                      }
                    </select>

                  </div>

                </div>

                <div className="w-full flex justify-end">
                  <button type="button" onClick={createCategory} className="h-10 rounded-md mr-3 justify-center w-[80px] text-white bg-blue-600 p-2 flex items-center hover:bg-blue-700">Salvar</button>

                  <button type="button" onClick={() => setShowInput(!showInput)} className="text-blue-600 hover:text-blue-700">Cancelar</button>
                </div>

              </div>
              :
              null
          }


          {
            //@ts-ignore
            categorySelected?.name == 'Salário' || !categorySelected?.name
            ?
            <>
              <label htmlFor="date" className="text-[#444557] mt-8">Data</label>
              <input
                className="h-10 w-full pl-3 bg-[#F5F5FE] text-[#444557] rounded-xl border-none"
                placeholder="Informe uma data"
                type="date"
                {...register('date')}
              />
              {errors.date && <span className="text-[red] text-[14px]">{errors.date.message}</span>}

              <Button className="m-auto mt-8" type="button" onClick={handleSubmit(createTransaction)}>Pagar Salários</Button>
            </>
            :
            <>
              <label htmlFor="value" className="text-[#444557] mt-8">Valor</label>
              <input
                className="h-10 w-full pl-3 bg-[#F5F5FE] text-[#444557] rounded-xl border-none"
                placeholder="Informe o valor"
                type="number"
                defaultValue={0}
                {...register('value', {valueAsNumber: true})}
              />
              {errors.value && <span className="text-[red] text-[14px]">{errors.value.message}</span>}

              <label htmlFor="description" className="text-[#444557] mt-8">Descrição</label>
              <input
                className="h-10 w-full pl-3 bg-[#F5F5FE] text-[#444557] rounded-xl border-none"
                placeholder="Informe uma descrição"
                type="text"
                {...register("description")}
              />
              {errors.description && <span className="text-[red] text-[14px]">{errors.description.message}</span>}



              <label htmlFor="company" className="text-[#444557] mt-8">Empresa</label>

              <select 
              name="companys" 
              className="h-10 w-full pl-3 bg-[#F5F5FE] text-[#444557] rounded-xl border-none"
              onChange={(e) => setCompanyId(Number(e.target.value))}
              >
                {
                  companys.map((company: any) => {
                    return <option value={company.id}>{company.name}</option>
                  })
                }
              </select>


              <label htmlFor="date" className="text-[#444557] mt-8">Data</label>
              <input
                className="h-10 w-full pl-3 bg-[#F5F5FE] text-[#444557] rounded-xl border-none"
                placeholder="Informe uma data"
                type="date"
                {...register('date')}
              />
              {errors.date && <span className="text-[red] text-[14px]">{errors.date.message}</span>}

              <label htmlFor="type" className="text-[#444557] mt-8">Tipo</label>
              <Select
                className="h-10 rounded-xl bg-[#F5F5FE] text-[#444557] pl-3"
                options={[
                  {
                    id: 1,
                    name: 'Receita'
                  },
                  {
                    id: 2,
                    name: 'Despesa'
                  }
                ]}
                {...register('type')}
              />
              {errors.type && <span className="text-[red] text-[14px]">{errors.type.message}</span>}

              <label htmlFor="status" className="text-[#444557] mt-8">Status</label>
              <Select
                className="mb-8 h-10 rounded-xl bg-[#F5F5FE] text-[#444557] pl-3"
                options={[
                  {
                    id: 0,
                    name: 'Não Pago'
                  },
                  {
                    id: 1,
                    name: 'Pago'
                  }
                ]}
              {...register('status')}
              />
              {errors.status && <span className="text-[red] text-[14px]">{errors.status.message}</span>}

              <Button className="m-auto" type="button" onClick={handleSubmit(createTransaction)}>Cadastrar</Button>
            
            </>
          }

        </form>

      </div>
      <Modal className="z-50" isOpen={isModalOpen} onClose={() => setIsModalOpen(!isModalOpen)}>
        <form>
          <div>
            <label htmlFor="type" className="text-[#444557]">Nome</label>
            <input type="text" className="bg-[#F5F5FE] outline-none w-full h-10 mb-3 rounded-xl pl-3 text-[#444557]" placeholder="Nome da nova categoria"
              onChange={(e: any) => { setNewNameCategory(e.target.value) }} />
          </div>

          <div className="w-full flex justify-end">
            {/* @ts-ignore */}
            <button type="button" onClick={() => updateCategory(categorySelected.id, newNameCategory)} className="h-10 rounded-md mr-3 justify-center w-[80px] text-white bg-blue-600 p-2 flex items-center hover:bg-blue-700">Salvar</button>

            <button type="button" onClick={() => setIsModalOpen(!isModalOpen)} className="text-blue-600 hover:text-blue-700">Cancelar</button>
          </div>

        </form>
      </Modal>
      {alert && <Alert message={alert} />}
    </>
  );
}