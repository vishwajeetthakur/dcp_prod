import * as React from 'react';
import { useCallback } from 'react';
import { useState } from "react";


const useHttp = () => {
  const [error, setError] = useState(null)

  const sendRequest = useCallback(async (requestConfig, applyData)=> {
    setError(null);
    try{
      const response = await requestConfig.APICall;
     if(response.data)applyData(response.data);

    }catch(err){
      setError(err.message || 'Something went wrong!! Try again!!')
    }
  }, [])

return {
    error,
    sendRequest
  }
}


export default useHttp;