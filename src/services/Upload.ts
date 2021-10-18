import axios from '@/plugins/axios';

class UploadService {
  baseURL = ''

  constructor() {
    this.baseURL = `${process.env.VUE_APP_BASE_URL}/uploads`;
  }

  async upload(payload: {}): Promise<any> {
    const res = await axios.post(`${this.baseURL}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  }
}

export default UploadService;
