import { useContext, useEffect } from "react";
import { ContentContext } from "../../../../context/ContentContext";
import { clearLocalStorage } from "../../../../helper/helper";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { setIsLoading } = useContext(ContentContext);
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    clearLocalStorage();
    document.documentElement.setAttribute("data-bs-theme", "light");
    setIsLoading(false);
    navigate("/");
  }, []);
  return <></>;
};

export default Logout;
