// fetcher.js
export const fetcher = async (url) => {
    const response = await fetch(url);
  
    if (!response.ok) {
      const errorDetails = await response.json();
      const error = new Error('An error occurred while fetching the data.');
      error.details = errorDetails;
      throw error;
    }
  
    return response.json();
  };
  