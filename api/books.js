export const getBookByISBN = async (isbn) => {
  try{

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
      );
      
      return await response.json();
    }
    catch(err){
      console.error(err)
      return null
    }
  };
  