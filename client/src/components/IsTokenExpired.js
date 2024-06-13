const isTokenExpired = (token) => {
  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));

    if (payload && payload.exp) {
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      return expirationTime < currentTime;
    }
  } catch (error) {
    console.error('Error decoding or checking expiration:', error);
  }
  return true;
};

export default isTokenExpired;
