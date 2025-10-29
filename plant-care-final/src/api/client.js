import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 식물 종 식별 API 호출
 * @param {File[]} images - 업로드할 이미지 파일 배열 (1~3장)
 * @returns {Promise} { topK: [{id, name, conf}], diagnosis: [...] }
 */
export async function identifyPlant(images) {
  const formData = new FormData();
  images.forEach((img) => {
    formData.append('image', img);
  });

  const response = await apiClient.post('/identify', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export default apiClient;

