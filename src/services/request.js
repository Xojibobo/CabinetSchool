import axios from "axios";

const request = axios.create({
    baseURL: 'https://670e4ba0073307b4ee464482.mockapi.io',
    timeout: 10000,
});

export default request;
