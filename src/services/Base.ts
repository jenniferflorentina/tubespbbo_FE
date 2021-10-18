// eslint-disable-next-line import/no-cycle
import axios from '@/plugins/axios';

class BaseService {
  baseURL = '';

  constructor(subURL = '') {
    this.baseURL = `${process.env.VUE_APP_BASE_URL}${subURL}`;
  }

  async get(params = ''): Promise<any[] | any> {
    const res = await axios.get(`${this.baseURL}?${params}`);
    return res.data;
  }

  async getBlob(params = ''): Promise<any[] | any> {
    const res = await axios.get(`${this.baseURL}?${params}`, {
      responseType: 'blob',
    });
    return res.data;
  }

  async getOne(id, params = ''): Promise<any> {
    const res = await axios.get(`${this.baseURL}/${id}?${params}`);
    return res.data;
  }

  async post(payload: {}): Promise<any> {
    const res = await axios.post(`${this.baseURL}`, payload);
    return res.data;
  }

  async upload(payload: {}): Promise<any> {
    const res = await axios.post(`${this.baseURL}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res;
  }

  async put(id, payload: {}): Promise<any> {
    const res = await axios.put(`${this.baseURL}/${id}`, payload);
    return res.data;
  }

  async putProcess(id): Promise<any> {
    const res = await axios.put(`${this.baseURL}/${id}`);
    return res.data;
  }

  async delete(id: number): Promise<any> {
    const res = await axios.delete(`${this.baseURL}/${id}`);
    return res.data;
  }

  async deletePayload(payload: any): Promise<any> {
    const res = await axios.delete(`${this.baseURL}`, { data: payload });
    return res.data;
  }

  async putString(resourceId: string, payload: {}): Promise<any> {
    const res = await axios.put(`${this.baseURL}/${resourceId}`, payload);
    return res.data;
  }

  async putPayload(payload: {}): Promise<any> {
    const res = await axios.put(`${this.baseURL}`, payload);
    return res.data;
  }

  async deleteMultiple(params = ''): Promise<any> {
    const res = await axios.delete(`${this.baseURL}?${params}`);
    return res.data;
  }
}

export default BaseService;
