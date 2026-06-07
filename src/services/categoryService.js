import { publicClient } from "./api/httpClient";

export const categoryService = {
  fetchCategories: async () => {
    try {
      const response = await publicClient.get("/api/v1/service-categories");
      if (response.data && response.data.data) {
        return response.data.data.map((category) => ({
          value: category.slug,
          label: category.name,
        }));
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error; // Let callers handle fallback
    }
  },
};
