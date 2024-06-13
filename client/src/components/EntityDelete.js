import axios from 'axios';
import isTokenExpired from './IsTokenExpired';

const deleteEntity = async (entityType, deletePath) => {
  const confirmed = window.confirm(`Are you sure you want to delete this ${entityType}?`);
  if (!confirmed) return false;

  let accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const isAccessTokenExpired = isTokenExpired(accessToken);
  const isRefreshTokenExpired = isTokenExpired(refreshToken);

  if (isAccessTokenExpired) {
    const response = await axios.post('https://localhost:7036/api/accessToken', { refreshToken });
    if (response && response.data) {
      accessToken = response.data.accessToken;
      localStorage.setItem('accessToken', accessToken);
    } else {
      console.error('Error refreshing token:', response);
      return false;
    }
  }

  try {
    await axios.delete(deletePath, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return true;
  } catch (error) {
    console.error(`Error deleting ${entityType}:`, error);
    return false;
  }
};

export default deleteEntity;
