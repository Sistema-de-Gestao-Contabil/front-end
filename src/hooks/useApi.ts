import axios from "axios";

export const endPoint = axios.create({
  baseURL: "http://localhost:8181",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export async function useApi<T = unknown>(url: string) {
  return await axios
    .get(`${endPoint.defaults.baseURL}/${url}`)
    .then((data) => data.data)
    .catch((err) => {
      console.log(err);
    });
}