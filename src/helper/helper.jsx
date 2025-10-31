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


let trackingQueue = Promise.resolve();
export const trackingUserAction = (actionType, actionValue = "", currentTabValue = "resources") => {
  // Define what each request should do
  const task = async () => {
    const payload = {
      action: actionType,
      value: actionValue,
      current_tab: currentTabValue,
    };
    try {
      await postData(endPoint.Tracking, payload);
    } catch (error) {
      console.log("Error tracking user action:", error);
    }
  };
  trackingQueue = trackingQueue.finally(() => task());
};