import axios, { AxiosRequestConfig } from 'axios';

export const endPoint = axios.create({
  baseURL: "http://localhost:8181/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export async function useApi<T = unknown>(
  method: AxiosRequestConfig['method'],
  url: string,
  data?: any,
  headers?: any
) {
  try {
    // Obtenha o token do localStorage
    const token = localStorage.getItem('token');

    // Crie um objeto de cabeçalho padrão com Content-Type e Accept
    const defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (token) {
      (defaultHeaders as any)['Authorization'] = `Bearer ${token}`;
    }

    const mergedHeaders = {
      ...defaultHeaders,
      ...headers,
    };

    console.log(url + (data ? `?${data}` : ''))

    const response = await endPoint.request({
      method,
      url: url + (data ? `?${data}` : ''), // Adicione a string de consulta se houver dados
      data,
      headers: mergedHeaders, // Use os cabeçalhos combinados
    });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}