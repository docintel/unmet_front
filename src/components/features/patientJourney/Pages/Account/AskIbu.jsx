import { fetchYourQuestions } from "../../../../../services/homeService";
import { useContext, useEffect, useState } from "react";
import { ContentContext } from "../../../../../context/ContentContext";
import AskIbuScroll from "../../Common/AskIbuScroll";

const AskIbu = () => {
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
      setQuestionData(questionList.questions);
    }
  }, [questionList]);

  return (
    <>
      {questionList.loading ? (
        <>Loading...</>
      ) : questionList.error ? (
        <>Error...</>
      ) : !questionData || questionData.length === 0 ? (
        <>No data</>
      ) : (
        <AskIbuScroll items={questionData} itemCount={6} account={true} />
      )}
      {/* {questionData.map((question, index) => {
        return (
          <div key={index}>
            <QuestionCard question={question} account={true} />
          </div>
        );
      })} */}
    </>
  );
};
export default AskIbu;
