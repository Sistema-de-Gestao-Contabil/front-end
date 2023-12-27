/* eslint-disable react/jsx-key */
import React, { ComponentProps, useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { Icon } from "@iconify/react";
import Select from "@/components/Select";


export interface OptionProps {
  id: number;
  name: string;
}

export type SelectProps = ComponentProps<"select"> & {
  //options: object[];
};

export default function SelectCategorys({ ...props }: SelectProps) {
    const [categorys, setCategorys] = useState<object[]>([])
    const [showSelect, setShowSelect] = useState(false)
    const [categorySelected, setCategorySelected] = useState<object>()
    const [showInput, setShowInput] = useState(false)
    const [newNameCategory, setNewNameCategory] = useState()
    const [newTypeCategory, setNewTypeCategory] = useState(1)
    

  const findAllCategorys = async () => {
    const response = await useApi('get', 'categorys')
    setCategorys(response.result)
    
  }

  const createCategory = async () => {
    console.log({newNameCategory, newTypeCategory});
    
    const response = await useApi('post', 'categorys/1', {
      name: newNameCategory,
      type: newTypeCategory == 1 ? 'receita' : 'despesa'
    })

    if(response.status == 200){
      alert('Categoria criada com sucesso.')
    }
    
    setShowInput(!showInput)
    findAllCategorys()

  }

  useEffect(() => {
    findAllCategorys()
  },[])

  return (
    <>
      <div className="flex-col items-center justify-center cursor-pointer">

        <div className="w-full z-50">
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

              <Icon icon="ep:arrow-down-bold" width="12" height="12"/>
            </div>
            

            <button type="button" className=" ml-3 bg-blue-600 h-10 flex justify-center items-center text-white w-10 rounded-md" onClick={() => {setShowInput(!showInput)}}>
              <Icon icon="typcn:plus" width="30"/>
            </button>
          </div>

          <div style={showSelect ? {} : {display: 'none'}}  className="max-h-[300px] overflow-y-scroll">
            {categorys.map((item:any) => (
              <div 
              className="flex items-center p-3 h-full bg-[#F5F5FE]  text-[#444557] hover:border-2 border-blue-600 hover:text-blue-600" 
              key={item.id} 
              >

                <div onClick={() => {setCategorySelected(item); setShowSelect(!showSelect); return categorySelected}} className="w-[75%]">
                  {item.name}
                </div>

                <div className="w-[25%] flex gap-3">
                  <button type="button" className="h-10 rounded-md text-white bg-blue-600 p-2 flex items-center hover:bg-blue-700">Editar</button>
                  <button type="button" className="text-blue-600 hover:text-blue-700">Excluir</button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {
          showInput
          ?
          <div className=" mt-10 flex-col items-center rounded-xl border-2 border-blue-600 p-5">

            <div className="flex-col">
              <div>
                <input type="text" className="bg-[#F5F5FE] outline-none w-full h-10 mb-3 rounded-xl pl-3 text-[#444557]" placeholder="Nome da nova categoria" 
                onChange={(e:any) => {setNewNameCategory(e.target.value)}}/>
              </div>

              <div className="flex-col">
                <label htmlFor="type" className="text-[#444557]">Tipo</label>
                <Select 
                className="mb-8 h-10 rounded-xl bg-[#F5F5FE] w-full text-[#444557] pl-3" 
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
                onChange={(e:any) => {setNewTypeCategory(e.target.value)
                }}
                />
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
        
        
      </div> 
    </>
  );
}
