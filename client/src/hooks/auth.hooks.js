import axiosInstance from "../lib/index";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetLoggedInUser = () => {
  return useQuery({
    queryKey: ["LOGGED_IN_USER"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/api/auth/me`);
        if (!res.data.success) {
          return null;
        }
        return res.data.user;
      } catch (error) {
        return null;
      }
    },
  });
};

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData) => {
      try {
        const res = await axiosInstance.post("/api/auth/register", userData);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return true;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["LOGGED_IN_USER"]);
    },
  });
};

export const useLoginUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData) => {
      try {
        const res = await axiosInstance.post("/api/auth/login", userData);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return true;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["LOGGED_IN_USER"]);
    },
  });
};

export const useLogoutUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        const res = await axiosInstance.post("/api/auth/logout");
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return true;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["LOGGED_IN_USER"]);
    },
  });
};

export const useSearchUser = () => {
  return useMutation({
    mutationFn: async (identifier) => {
      try {
        const res = await axiosInstance.post(
          `/api/users/search?identifier=${identifier}`
        );
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data.users;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await axiosInstance.post(`/api/users/follow/${userId}`);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data.user;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["LOGGED_IN_USER", "USER_BY_USERNAME"]);
    },
  });
};

export const useUserByUsername = (username) => {
  return useQuery({
    queryKey: ["USER_BY_USERNAME"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/api/users/${username}`);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data.user;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData) => {
      try {
        const res = await axiosInstance.put(
          "/api/users/update-profile",
          userData
        );
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data.message;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["LOGGED_IN_USER"]);
    },
  });
};

export const useGetSuggestedUsers = () => {
  return useQuery({
    queryKey: ["SUGGESTED_USERS"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/api/users/suggested");
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data.users;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
  });
};
