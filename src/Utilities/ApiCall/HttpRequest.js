import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;


const HttpRequest = async ({ method, url, data }) => {  
  try {
    const token = localStorage.getItem('_Auth');
    
    // Default headers including authorization
    const headers = {
      Authorization: `Bearer ${token}`,
      // Content-Type will be inferred by axios based on `data`
    };

    const response = await axios({
      method,
      url: `${baseUrl}${url}`,
      data: data, // Data can be either FormData, JSON, or any other valid format
      headers,
    });

    // Handle successful response
    return response.data;
  } catch (error) {
    // Handle errors robustly
    const errorData = error.response ? error.response.data : { message: 'An error occurred' };
    throw errorData;
  }
};

export default HttpRequest;
