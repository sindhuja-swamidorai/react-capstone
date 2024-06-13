import { useEffect, useState } from "react";


export default function useFetch (url) {

    const [responseData, setResponseData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
    async function getResponse () {
        setLoading(true);
        try {
            console.log("Processing response data")
            let response = await fetch(url);
            if (response.ok) {
                let json = await response.json();
                //console.log(json);
                setResponseData(json);
            }  
            else {
                throw response;
            }
        }
        catch (err) {
            console.log("Error processing response data");
            console.log(err);
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }
    getResponse();
    //setResponseData(response);
    },[url]);


    console.log(responseData, loading, error);
    return (
            {responseData, loading, error}
        )    

}
