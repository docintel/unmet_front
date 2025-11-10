import { postData, getData } from "./axios/apiHelper";
import endPoint from "./axios/apiEndpoint";

export const fetchAgeGroupCategories = async (
  setIsLoading,
  setToast,
  setFilterCategory,
  setFilterAges
) =>
{
  try {
    setIsLoading(true);
    setFilterCategory({
      loading: true,
      error: false,
      data: [],
    });
    setFilterAges({
      loading: true,
      error: false,
      data: [],
    });
    const data = await getData(endPoint.GET_AGE_GROUP_CATEGORIES);
    const itemList = data?.data?.data?.ageGroups.map((item) =>
    {
      const id = item.id;
      const label =
        item.label +
        (`<br />Age ${(parseInt(item.min_age) == 0 && "&lt;") ||
          (item.max_age === null && "&gt;") ||
          ""
          }` +
          (item.max_age
            ? item.min_age === 0
              ? item.max_age
              : item.min_age + "-" + item.max_age
            : item.min_age));
      return {
        id,
        label,
        allImage: item.all_tab_thumb,
        femaleImage: item.female_tab_thumb,
      };
    });
    const catArr= ["Diagnosis","Surgery","Pregnancy & Childbirth","HMB","Joint & Bone Health","WIL-PROPHY","Personalized Prophylaxis","On-demand"];
    let catItem = [];
    catArr.forEach((item)=>{
      data?.data?.data?.categories.forEach((cat)=>{
        if(cat.name === item) catItem = [...catItem,cat]
      })
    })
    setFilterCategory({
      loading: false,
      error: false,
      data: catItem,
    });
    setFilterAges({
      loading: false,
      error: false,
      data: itemList,
    });
    return {
      contentCategory: data?.data?.data?.contentCategory,
    };
  } catch (error) {
    console.error("Error fetching age groups and categories:", error);
    setFilterCategory({
      loading: false,
      error: true,
      data: [],
    });
    setFilterAges({
      loading: false,
      error: true,
      data: [],
    });
    setToast({
      show: true,
      type: "danger",
      title: "Error",
      message: "Oops!! failed to fetch age groups and categories.",
    });
  } finally {
    setIsLoading(false);
  }
};

export const fetchNarrativeList = async (
  narration_type,
  setIsLoading,
  setToast
) =>
{
  try {
    setIsLoading(true);
    const data = await getData(endPoint.FETCH_NARRATION_LIST);
    const response = data?.data?.data.filter(
      (item) => item.narration_type === narration_type
    );

    return { narratives: response };
  } catch (error) {
    console.error("Error fetching narration list:", error);
    setToast({
      show: true,
      type: "danger",
      title: "Error",
      message: "Oops!! failed to fetch narrative list.",
    });
  } finally {
    setIsLoading(false);
  }
};

export const fetchContentList = async (setIsLoading, setToast, setContents) =>
{
  try {
    setIsLoading(true);
    setContents({
      loading: true,
      error: false,
      data: [],
    });
    const data = await getData(endPoint.FETCH_CONTENT_LIST);
    setContents({
      loading: false,
      error: false,
      data: data?.data?.data,
    });
  } catch (error) {
    console.error("Error fetching content list:", error);
    setToast({
      show: true,
      type: "danger",
      title: "Error",
      message: "Oops!! failed to fetch content list.",
    });
    setContents({
      loading: false,
      error: true,
      data: [],
    });
  } finally {
    setIsLoading(false);
  }
};

export const updateContentRating = async (id, setIsLoading, setToast) =>
{
  try {
    setIsLoading(true);

    const data = await postData(endPoint.UPDATE_CONTENT_RATING, {
      pdf_id: id,
    });
    return { response: data?.data?.data?.total_ratings };
  } catch (error) {
    console.error("Error while updating rating:", error);
    setToast({
      show: true,
      type: "danger",
      title: "Error",
      message: "Oops!! failed to update content rating.",
    });
    throw new Error("Error while updating rating");
  } finally {
    setIsLoading(false);
  }
};

export const TrackDownloads = async (id, setIsLoading, setToast) =>
{
  try {
    // setIsLoading(true);

    const data = await postData(endPoint.TRACK_DOWNLOADS, {
      pdf_id: id,
    });
  } catch (error) {
    console.error("Error while updating rating:", error);
    throw new Error("Error while tracking download");
  } finally {
    // setIsLoading(false);
  }
};

export const SubmitShareContent = async (
  id,
  email,
  name,
  country,
  consent,
  setIsLoading,
  setToast
) =>
{
  try {
    setIsLoading(true);

    const data = await postData(endPoint.CONTENT_SHARE, {
      pdf_id: id,
      email: email,
      consent: consent,
      country: country?.value,
      name: name,
    });
  } catch (error) {
    console.error("Error while updating rating:", error);
    setToast({
      show: true,
      type: "danger",
      title: "Error",
      message: "Oops!! failed to share content.",
    });
    throw new Error("Error while sharing content");
  } finally {
    setIsLoading(false);
  }
};

export const GenerateQrcodeUrl = async (pdfId, setQrCodeUrl) =>
{
  try {
    setQrCodeUrl({
      loading: true,
      error: false,
      data: "",
    });

    const data = await postData(endPoint.GENERATE_QRCODE_URL, {
      pdf_id: pdfId,
    });


    if (data.status === 201) {
      setQrCodeUrl({
        loading: false,
        error: false,
        data: data.data.data.url,
      });
    } else {
      setQrCodeUrl({
        loading: false,
        error: true,
        data: "",
      });
    }
  } catch (ex) {
    setQrCodeUrl({
      loading: false,
      error: true,
      data: "",
    }); console.error("Error while updating rating:", error);

  }
};
