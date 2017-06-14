import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    'Authorization': 'bearer eae616fd37a48dabbf633e866d6d2d4e0515f775',
    'Content-Type': 'application/json',
  },
  mode: 'cors',
  withCredentials: false,
});

const request = {
  query (gql) {
    return axiosInstance({
      url: '',
      method: 'post',
      data: {
        query: gql,
        variables: "{}",
      },
    });
  }
}


export default request;
