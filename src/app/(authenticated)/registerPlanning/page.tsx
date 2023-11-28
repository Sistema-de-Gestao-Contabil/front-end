import Button from "../../../components/Button";

export default function Planning() {
    return (
        <div className="container mx-auto px-4 flex min-h-screen flex-col bg-white">
            <p className="text-xl mt-5">Planejamentos</p>
            <p className="text-sm text-[#908B8B]">
                Gerencie seus planejamentos mensais
            </p>
            <div className="mt-12">
                <p className="text-center text-xl text-[#6174EE]">
                    <b>Registrar Planejamento</b>
                </p>
                <hr className="mt-3 mb-4"></hr>
                <p>
                    <b>Selecione o mês que deseja gerar o planejamento:</b>
                </p>
                <input className="w-40 bg-[#E9E9FF] h-8 rounded" id="date" type="month"/>
                <p className="mt-5">
                    <b>Selecione o valor que pretende gastar no mês:</b>
                </p>
                <input className="w-40 bg-[#E9E9FF] h-8 rounded" id="number" type="number" step="0.01" placeholder="R$ 0,00"/>
                <div className="flex justify-end">
                    <Button>+ Salvar</Button>
                </div>
                <hr className="mt-3 mb-4"></hr>
                <div className="grid justify-items-center">
                    <p className=" text-xl text-[#6174EE]">
                        <b>Metas e Orçamentos</b>
                    </p>
                    <p className="text-sm text-[#908B8B]">
                        Atribua um valor a cada categoria
                    </p>
                </div>
                <table className="border-separate border-spacing-2 border-slate-400 table-fixed bg-[#E9E9FF]">
                    <thead>
                        <tr>
                            <th>Categorias</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border-slate-300">Aluguel</td>
                            <td className="border-slate-300 "><input className="w-40 bg-[#E9E9FF] h-8 rounded" id="number" type="number" step="0.01" placeholder="R$ 0,00"/></td>
                        </tr>
                        <tr>
                            <td className="border-slate-300">Categoria</td>
                            <td className="border-slate-300 "><input className="w-40 bg-[#E9E9FF] h-8 rounded" id="number" type="number" step="0.01" placeholder="R$ 0,00"/></td>
                        </tr>
                    </tbody>
                </table>
                <div className="flex justify-end">
                    <Button>Finalizar</Button>
                </div>
            </div>
        </div>
    );
}
