




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
      actionType,
      actionValue,
      timestamp: new Date().toISOString(),
      currentTabValue
     }
  try {

    console.log("Tracking User Action:", payload);

  } catch (error) {

  }

}