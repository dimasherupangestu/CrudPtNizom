import axios from "axios";

export const apiAll = axios.create({
  baseURL: "https://nizom-sale-open-api.vercel.app/api/",
});
