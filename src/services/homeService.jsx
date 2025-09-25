 import { postData ,getData} from "./axios/apiHelper";
 import endPoint from "./axios/apiEndpoint";
   
export const fetchQuestions = async (setLoading) => {
      try {
        const response = await getData(endPoint.ALL_QUESTIONS);
        return response?.data?.data
       
      } catch (error) {
        console.error("Error fetching Ask IBU questions:", error);
      } finally {
        setLoading(false);
      }
    };


export const handleSubmit = async (e,setError,question,setQuestion) => {
    e.preventDefault();

  console.log("handleSubmit")

    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    setError(""); 
    try {
      const response = await postData(
        "/auth/add-ibu-question",
        {
          userId: 321,
          question: question,
        },
      );


      setQuestion("");
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };