import { fetchYourQuestions } from "../../../../../services/homeService";
import { useContext, useEffect, useState } from "react";
import { ContentContext } from "../../../../../context/ContentContext";
import AskIbuScroll from "../../Common/AskIbuScroll";
import NoData from "../../Common/NoData";
import { useNavigate } from "react-router-dom";

const AskIbu = ({ setQuestionCount }) =>
{
  const { setIsLoading } = useContext(ContentContext);
  const [questionData, setQuestionData] = useState([]);
  const [questionList, setQuestionList] = useState({
    loading: false,
    error: false,
    questions: [],
  });
  const navigate = useNavigate();
  useEffect(() =>
  {
    (async () =>
    {
      await fetchYourQuestions(setIsLoading, setQuestionList);
    })();
  }, []);

  useEffect(() =>
  {
    if (
      !questionList.loading &&
      !questionList.error &&
      questionList.questions &&
      questionList.questions.length > 0
    ) {
      setQuestionData(
        [...questionList.questions].sort(
          (a, b) =>
            new Date(b.created.replaceAll(".", " ")) -
            new Date(a.created.replaceAll(".", " "))
        )
      );
      setQuestionCount(questionList.questions.length);
    }
  }, [questionList]);

  const updateDeleteQuestion = (qId, questionText, isUpdate) =>
  {
    if (isUpdate) {
      const updatedData = [];
      questionList.questions.forEach((item) =>
      {
        if (item.id === qId) {
          let updatedObj = { ...item };
          updatedObj.question = questionText;
          updatedData.push(updatedObj);
        } else updatedData.push(item);
      });
      setQuestionList({ ...questionList, questions: updatedData });
    } else {
      const updatedData = questionList.questions.filter(
        (item) => item.id !== qId
      );
      setQuestionList({ ...questionList, questions: updatedData });
    }
  };

  return (
    <>
      {questionList.loading ? (
        <></>
      ) : questionList.error ? (
        <></>
      ) : !questionData || questionData.length === 0 ? (
        <NoData
          image="bubble-chat-question.svg"
          title="You haven&apos;t asked IBU anything yet!"
          description="Have something in mind?"
          buttonText="Ask Your First Question"
          onClick={() => navigate("/")}
        />
      ) : (
        <AskIbuScroll items={questionData} itemCount={6} account={true} updateDeleteQuestion={updateDeleteQuestion} />
      )}
    </>
  );
};
export default AskIbu;
