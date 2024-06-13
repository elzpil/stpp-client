import axios from 'axios';

const fetchUserName = async (userId) => {
  try {
    const userResponse = await axios.get(`https://localhost:7036/api/users/${userId}`);
    return userResponse.data.username;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    return null;
  }
};

export default fetchUserName;