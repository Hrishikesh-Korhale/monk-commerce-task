import axios from "axios";

export const fetchProducts = async (search = "", page = 1, limit = 10) => {
  const response = await axios.get(
    "http://stageapi.monkcommerce.app/task/products/search",
    {
      headers: {
        "x-api-key": "72njgfa948d9aS7gs5",
      },
      params: { search, page, limit },
    }
  );
  return response.data;
};
