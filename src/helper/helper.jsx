import endPoint from "../services/axios/apiEndpoint";
import { postData } from "../services/axios/apiHelper";




export const clearLocalStorage = () => {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key) {
            localStorage.removeItem(key);
          }
        }
      };

export function stripHTML(htmlString) {
  const tmp = document.createElement("div");
  tmp.innerHTML = htmlString;
  return tmp.textContent || tmp.innerText || "";
}


export const trackingUserAction = async (actionType, actionValue = "",currentTabValue = "resources") => {
  console.log(currentTabValue,"currentTabValue")
     const payload = {
      action: actionType,
      value: actionValue,
      current_tab : currentTabValue
     }
  try {
   const res= await postData(endPoint.Tracking, payload);

    console.log("Tracking User Action:", res);

  } catch (error) {
    console.log("Error tracking user action:", error);

  }

}