import React from "react";

const AskIBU = () => {
  const askIbu = [
    {
      id: 13,
      user_id: 321,
      user_name: "Alisha",
      country: "India",
      visibility_status: "Private",
      question:
        "User Q masuismod phartra donec faucibus quisque nuneque mote condi ment zcsum nudolor nibhcmasa euismod phartra donec mas faucim nunc penatibus magna volutpat malesuada ullamcorper. Turpis nullam amet faucibbus quisque nuneque ipsum quamodio............................?",
      answer: "all answers",
      status: 0,
      topics: ["valuweNew", "newwww"],
      delete_status: 0,
      updated: "2025-09-24T04:12:02.000Z",
      created: "2025-09-19T05:29:37.000Z",
    },
    {
      id: 10,
      user_id: 321,
      user_name: "Alisha",
      country: "India",
      visibility_status: "Published",
      question:
        "User Q masuismod phartra donec faucibus quisque nuneque mote condi ment zcsum nudolor nibhcmasa euismod phartra donec mas faucim nunc penatibus magna volutpat malesuada ullamcorper. Turpis nullam amet faucibbus quisque nuneque ipsum quamodio............................?",
      answer: "this is ignore answer",
      status: 0,
      topics: ["topics", "new", "tags"],
      delete_status: 0,
      updated: "2025-09-24T04:04:18.000Z",
      created: "2025-09-19T05:29:37.000Z",
    },
  ];
  return (
    <>
      {askIbu.map(() => (
        <>
          <div className="detail-data-box">
            <div className="content-box">
              <div className="format">
                

              
              </div>
             
            </div>
          </div>
        </>
      ))}
    </>
  );
};

export default AskIBU;
