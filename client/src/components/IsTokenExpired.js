const isTokenExpired = (token) => {
  try {
    // Extract the second part of the token (payload)
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));

    // If the payload contains an expiration time, check it
    if (payload && payload.exp) {
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      return expirationTime < currentTime;
    }
  } catch (error) {
    // Handle decoding or other errors
    console.error('Error decoding or checking expiration:', error);
  }

  // Return true if there's an error or if the token is expired
  return true;
};

export default isTokenExpired;
