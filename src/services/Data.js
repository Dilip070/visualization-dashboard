// import { data } from "../data";
import axios from "axios";

const API_URL='http://localhost:8000/insight/getAll';

const getAllData = async () => {
  try {
    // return data;
    const response = await axios.get(API_URL);
    console.log('Insight API response: ', { API_URL, status: response.status, response });
    if (response?.status !== 200) {
      return new Error('Something went wrong', response);
    }
    return response.data;
  } catch (error) {
    console.log('Insight API failed ', error);
    throw error;
  }
};

export default getAllData;