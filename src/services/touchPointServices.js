import { postData, getData } from "./axios/apiHelper";
import endPoint from "./axios/apiEndpoint";

export const fetchAgeGroupCategories = async () => {
  try {
    const data = await getData(endPoint.GET_AGE_GROUP_CATEGORIES);
    const itemList = data?.data?.data?.ageGroups.map((item) => {
      const id = item.id;
      const label =
        item.label +
        (`<br />Age ${
          (parseInt(item.min_age) == 0 && "&lt;") ||
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

    return {
      ageGroups: itemList,
      category: data?.data?.data?.categories,
      tags: data?.data?.data?.tags,
    };
  } catch (error) {
    console.error("Error fetching age groups and categories:", error);
  } finally {
  }
};

export const fetchNarrativeList = async (narration_type) => {
  try {
    const data = await getData(endPoint.FETCH_NARRATION_LIST);
    const response = data?.data?.data.filter(
      (item) => item.narration_type === narration_type
    );

    return { narratives: response };
  } catch (error) {
    console.error("Error fetching narration list:", error);
  } finally {
  }
};

export const fetchContentList = async () => {
  try {
    const data = await getData(endPoint.FETCH_CONTENT_LIST);

    return { contents: data?.data?.data };
  } catch (error) {
    console.error("Error fetching narration list:", error);
  } finally {
  }
};

export const updateContentRating = async (id) => {
  try {
    const data = await postData(endPoint.UPDATE_CONTENT_RATING, {
      pdf_id: id,
    });
    return { response: data?.data?.data?.total_ratings };
  } catch (error) {
    console.error("Error while updating rating:", error);
    throw new Error("Error while updating rating");
  } finally {
  }
};

export const TrackDownloads = async (id) => {
  try {
    const data = await postData(endPoint.TRACK_DOWNLOADS, {
      pdf_id: id,
    });
  } catch (error) {
    console.error("Error while updating rating:", error);
    throw new Error("Error while tracking download");
  } finally {
  }
};

export const SubmitShareContent = async (id, email, message, name) => {
  try {
    const data = await postData(endPoint.CONTENT_SHARE, {
      pdf_id: id,
      email: email,
      message: message,
      name: name,
    });
  } catch (error) {
    console.error("Error while updating rating:", error);
    throw new Error("Error while sharing content");
  } finally {
  }
};
