import { publicClient } from "./api/httpClient";

export const categoryService = {
  fetchCategories: async () => {
    try {
      const response = await publicClient.get("/api/v1/public/service-categories");
      if (response.data && response.data.data) {
        // Return full categories so we can access their raw IDs and slugs
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error; // Let callers handle fallback
    }
  },
  fetchSubCategories: async (categoryId) => {
    try {
      const response = await publicClient.get("/api/v1/service-sub-categories", {
        params: categoryId ? { service_category_id: categoryId } : {}
      });
      if (response.data && response.data.data) {
        return response.data.data.map((sub) => ({
          value: sub.slug,
          label: sub.name,
        }));
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch sub-categories:", error);
      throw error;
    }
  },
};
