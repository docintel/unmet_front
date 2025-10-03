import { postData, getData } from "./axios/apiHelper";
import endPoint from "./axios/apiEndpoint";

export const fetchQuestions = async (setIsLoading) => {
  setIsLoading(true);
  try {
    const response = await getData(endPoint.ASK_IBU_QUESTIONS);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching Ask IBU questions:", error);
  } finally {
    setIsLoading(false);
  }
};

export const fetchYourQuestions = async (setIsLoading) => {
  setIsLoading(true);
  try {
    const response = await getData(endPoint.YOUR_QUESTION);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching Ask IBU questions:", error);
  } finally {
    setIsLoading(false);
  }
};

export const handleSubmit = async (
  e,
  setError,
  question,
  setQuestion,
  setIsLoading
) => {
  e.preventDefault();

  if (!question.trim()) {
    setError("Please enter a question");
    return;
  }

  setError("");
  setIsLoading(true);
  try {
    const response = await postData(endPoint.ADD_QUESTIONS, {
      question: question,
    });

    setQuestion("");
  } catch (error) {
    console.error("Error submitting question:", error);
  } finally {
    setIsLoading(false);
  }
};

export const fetchTags = async (setIsLoading) => {
  setIsLoading(true);
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
