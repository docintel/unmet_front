import { postData, getData } from "./axios/apiHelper";
import endPoint from "./axios/apiEndpoint";

export const fetchQuestions = async (setLoading) => {
  try {
    const response = await getData(endPoint.ASK_IBU_QUESTIONS);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching Ask IBU questions:", error);
  } finally {
    setLoading(false);
  }
};

export const handleSubmit = async (e, setError, question, setQuestion) => {
  e.preventDefault();

  // console.log("handleSubmit")

  if (!question.trim()) {
    setError("Please enter a question");
    return;
  }

  setError("");
  try {
    const response = await postData(endPoint.ADD_QUESTIONS, {
      question: question,
    });

    setQuestion("");
  } catch (error) {
    console.error("Error submitting question:", error);
  }
};

export const fetchTags = async () => {
  try {
    const response = await getData(endPoint.GET_AGE_GROUP_CATEGORIES);
    return response?.data?.data?.tags || [];
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
};



export const filterQuestionsByTags = (questions, appliedTags) => {
  if (!appliedTags || appliedTags.length === 0) return questions;

  return questions.filter((q) =>
    appliedTags.every((tag) => q.topics?.includes(tag))
  );
};


