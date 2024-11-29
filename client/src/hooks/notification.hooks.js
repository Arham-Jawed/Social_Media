import axiosInstance from "../lib/index";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetAllNotifications = () => {
  return useQuery({
    queryKey: ["ALL_NOTIFICATIONS"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/api/notifications");
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data.notifications;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
  });
};

export const useDeletedNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        const res = await axiosInstance.delete("/api/notifications");
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return true;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["ALL_NOTIFICATIONS"]);
    },
  });
};
