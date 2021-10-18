import axios from '@/plugins/axios';

class AuthService {
  baseURL = ''

  constructor(subURL = '') {
    this.baseURL = `${process.env.VUE_APP_BASE_URL}${subURL}`;
  }

  async post(payload: {}): Promise<any> {
    const res = await axios.post(`${this.baseURL}`, payload);
    return res.data;
  }

  async get(params = ''): Promise<any[] | any> {
    const res = await axios.get(`${this.baseURL}?${params}`);
    return res.data;
  }

  async put(payload: {}): Promise<any> {
    const res = await axios.put(`${this.baseURL}`, payload);
    return res.data;
  }
}

export default AuthService;
