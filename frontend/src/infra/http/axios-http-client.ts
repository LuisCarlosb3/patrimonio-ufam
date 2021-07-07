import axios, { AxiosResponse } from 'axios';

type HttpRequest = {
  url: string;
  method: HttpMethod;
  // eslint-disable-next-line
  body?: any;
  // eslint-disable-next-line
  headers?: any;
};

// eslint-disable-next-line
interface HttpClient<R = any> {
  request: (data: HttpRequest) => Promise<HttpResponse<R>>;
}

type HttpMethod = 'post' | 'get' | 'put' | 'delete';

enum HttpStatusCode {
  ok = 200,
  created = 201,
  noContent = 204,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  serverError = 500,
}

const baseUrl = 'http://localhost:3000/';

// eslint-disable-next-line
export type HttpResponse<T = any> = {
  statusCode: HttpStatusCode;
  body?: T;
};

export class AxiosHttpClient implements HttpClient {
  // eslint-disable-next-line class-methods-use-this
  async request(data: HttpRequest): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse;
    const user = localStorage.getItem('@Patrimonio:user');
    let dataUser = { name: '', token: '' };

    if (user) {
      dataUser = JSON.parse(user);
    }

    try {
      if (data.url !== 'login') {
        axiosResponse = await axios.request({
          url: baseUrl + data.url,
          method: data.method,
          data: data.body,
          headers: { 'x-access-token': dataUser?.token },
        });
      } else {
        axiosResponse = await axios.request({
          url: baseUrl + data.url,
          method: data.method,
          data: data.body,
          headers: data.headers,
        });
      }
    } catch (error) {
      axiosResponse = error.response;

      if (!axiosResponse) {
        axiosResponse = {
          data: [],
          status: 403,
          statusText: 'Forbidden',
          headers: '',
          config: {},
        };
      }
    }

    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    };
  }
}
