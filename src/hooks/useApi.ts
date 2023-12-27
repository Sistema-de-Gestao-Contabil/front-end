import axios from "axios";

export const endPoint = axios.create({
  baseURL: "http://localhost:8181/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// export async function useApi<T = unknown>(url: string) {
//   return await axios
//     .get(`${endPoint.defaults.baseURL}/${url}`)
//     .then((data) => data.data)
//     .catch((err) => {
//       console.log(err);
//     });
// }

/**
 * Realiza requisições para o backend
 * @param method método da requisição
 * @param url URL de destino
 * @param data dados que devem ser enviados
 */
export async function useApi<T = unknown>(method:'get'|'post'|'put'|'delete'|'options'|'patch', url:string, data?:any, headers?:any) {
  try {
    const response = await endPoint.request({
      method,
      //possibilita o uso de query string no método get, como por exemplo .../?name='Maria'
      url: url + ((data)?('?'+data):('')),
      data,
      headers,
    })

    if(response.status === 200){
      return response.data
    }

    if(response.status === 201){
      return response.data
    }

    else{
      throw new Error(response.statusText)
    }
    
  } catch (error) {
    console.log(error);
    alert(error)
    return Promise.reject(error);
  }
}