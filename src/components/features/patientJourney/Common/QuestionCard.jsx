import { useState } from "react";

const QuestionCard = ({ question, account }) =>
{
  const path_image = import.meta.env.VITE_IMAGES_PATH;

  const [isEditing, setIsEditing] = useState(false);
  const [waiting, setWaiting] = useState(false);
  return (
    <>
      <div className="detail-data-box ask-ibu-question" key="">
        <div className="question-header">
          <span className="question-label">Question</span>
          {account &&
            < div className="answer-status" >
              <img src={path_image + (waiting ? "timer-icon.svg" : "checked-icon.svg")} alt="" />
              <span className="info-message">{waiting ? "Waiting for IBU’s answer..." : "Answered by IBU"}</span>
            </div>
          }
        </div>
        <div className="content-box">
          <div className="heading">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's{" "}
          </div>
          {account && (
            <textarea
              className="edit-input"
              placeholder="Edit your question..."
            ></textarea>
          )}
          <div className="region">Region, Country</div>
          {/* <hr className="divider" /> */}
          <div className="answer-section">
            <span className="answer-label">Answer</span>
            <div className="answer">
              Answer lorem ipsum dolor sit amet consectetur. Odio erat sed vitae
              pulvinar
            </div>
            <div className="q-tags">
              <div className="f-tag">Tag...</div>
              <div>Tag...</div>
              <div>Tag...</div>
            </div>
            <div className="footer">
              <div className="date">29.July.2025</div>
              {account && (
                <div className="q-actions">
                  {!isEditing ? (
                    <>
                      <button
                        className="icon-btn delete">
                        <img src={path_image + "delete-icon.svg"} alt="" />
                      </button>
                      <button
                        className="icon-btn edit"
                        onClick={() => setIsEditing(true)}
                      >
                        <img src={path_image + "edit-icon.svg"} alt="" />
                      </button>

                    </>
                  ) : (
                    <>
                      <button
                        className="cancel-btn"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="save-btn"
                        onClick={() => setIsEditing(false)}
                      >
                        Save
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionCard;
// import React, { useState } from "react";

// const QuestionCard = ({ question, account }) =>
// {
//   const [isEditing, setIsEditing] = useState(false);

//   return (
//     <div className="detail-data-box ask-ibu-question">
//       {/* Header */}
//       <div className="question-header">
//         <span className="question-label">Question</span>
//       </div>

//       {/* Content */}
//       <div className="content-box">
//         <div className="top-row">
//           {/* Question Text */}
//           {!isEditing ? (
//             <div className="heading">
//               Lorem Ipsum is simply dummy text of the printing and typesetting
//               industry. Lorem Ipsum has been the industry's
//             </div>
//           ) : (
//             <textarea
//               className="edit-input"
//               placeholder="Edit your question..."
//             />
//           )}

//           {/* ✅ Buttons only for account */}
//           {account && (
//             <div className="q-actions">
//               {!isEditing ? (
//                 <>
//                   <button
//                     className="icon-btn edit"
//                     onClick={() => setIsEditing(true)}
//                   >
//                     ✏️
//                   </button>
//                   <button className="icon-btn delete">🗑️</button>
//                 </>
//               ) : (
//                 <>
//                   <button
//                     className="cancel-btn"
//                     onClick={() => setIsEditing(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className="save-btn"
//                     onClick={() => setIsEditing(false)}
//                   >
//                     Save
//                   </button>
//                 </>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="region">Region, Country</div>

//         {/* Answer section */}
//         <div className="answer-section">
//           <span className="answer-label">Answer</span>
//           <div className="answer">
//             Answer lorem ipsum dolor sit amet consectetur. Odio erat sed vitae pulvinar
//           </div>

//           <div className="q-tags">
//             <div className="f-tag">Tag...</div>
//             <div>Tag...</div>
//             <div>Tag...</div>
//           </div>
//           <div className="date">29.July.2025</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuestionCard;

