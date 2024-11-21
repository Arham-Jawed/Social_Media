import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllNotifications = () => {
  return useQuery({
    queryKey: ["ALL_NOTIFICATIONS"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/v1/notifications");
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

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.delete("/api/v1/notifications");
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return true;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["ALL_NOTIFICATIONS"]);
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axios.delete(`/api/v1/notifications/${id}`);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return true;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["ALL_NOTIFICATIONS"]);
    },
  });
};
