import { postData, getData, putData, deleteData } from "./axios/apiHelper";
import endPoint from "./axios/apiEndpoint";
import { trackingUserAction } from "../helper/helper";

export const fetchQuestions = async (setIsLoading,setQuestList) => {
  setIsLoading(true);
  try {
    setQuestList({loading:true,error:false,questions:[]})
    const response = await getData(endPoint.ASK_IBU_QUESTIONS);
    const data =  response?.data?.data;
    setQuestList({loading:false,error:false,questions:data})
  } catch (error) {
    console.error("Error fetching Ask IBU questions:", error);
    setQuestList({loading:false,error:true,questions:[]})
  } finally {
    setIsLoading(false);
  }
};

export const fetchYourQuestions = async (setIsLoading,setQuestionList) => {
  setIsLoading(true);
  try {
    setQuestionList({
      loading: true,
      error: false,
      questions: [],
    })
    const response = await getData(endPoint.YOUR_QUESTION);
    const data =  response?.data?.data;
    setQuestionList({
      loading: false,
      error: false,
      questions: data,
    })
  } catch (error) {
    setQuestionList({
      loading: false,
      error: true,
      questions: [],
    })
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
  setIsLoading,
  setToast,
  setShowConfirmationModal,
  currentTabValue
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
    setShowConfirmationModal(true)
    setQuestion("");
    trackingUserAction(
      "question_submit",
      { question_id: response?.data?.data?.id },
      currentTabValue
    );
  } catch (error) {
    console.error("Error submitting question:", error);
    setToast({
      type: "danger",
      title: "Error",
      message: "Oops! Failed to submit the question.",
      show: true,
    });
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

export const updateIbuQuestion = async (qId, questionText, setIsLoading) => {
  try {
    setIsLoading(true);
    const data = { question_id: qId.toString(), question: questionText.trim() };
    await putData(endPoint.UPDATE_IBU_QUESTION, data);
  } catch (ex) {
    setIsLoading(false);
    console.log("exception while question update : ", ex);
    throw new Error("Failed to update the question")
  }finally{
    setIsLoading(false);
  }
};

export const deleteIbuQuestion = async (qId, setIsLoading) => {
  try {
    setIsLoading(true);
    await deleteData(endPoint.DELETE_IBU_QUESTION+"/"+qId.toString());
  } catch (ex) {
    setIsLoading(false);
    console.log("exception while deleting question : ", ex);
    throw new Error("Failed to delete the question")
  }finally{
    setIsLoading(false);
  }
};
