import { fetchYourQuestions } from "../../../../../services/homeService";
import { useContext, useEffect, useState } from "react";
import { ContentContext } from "../../../../../context/ContentContext";
import AskIbuScroll from "../../Common/AskIbuScroll";

const AskIbu = ({setQuestionCount}) => {
  const { setIsLoading } = useContext(ContentContext);
  const [questionData, setQuestionData] = useState([]);
  const [questionList, setQuestionList] = useState({
    loading: false,
    error: false,
    questions: [],
  });

  useEffect(() => {
    (async () => {
       await fetchYourQuestions(setIsLoading, setQuestionList);
    })();
  }, []);

  useEffect(() => {
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

  return (
    <>
      {questionList.loading ? (
        <></>
      ) : questionList.error ? (
        <></>
      ) : !questionData || questionData.length === 0 ? (
        <>No data</>
      ) : (
        <AskIbuScroll items={questionData} itemCount={6} account={true} />
      )}
    </>
  );
};
export default AskIbu;
