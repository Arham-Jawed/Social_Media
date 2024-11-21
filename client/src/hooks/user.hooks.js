import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetLoggedInUser = () => {
  return useQuery({
    queryKey: ["LOGGED_IN_USER"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/v1/users/me");
        if (!res.data.success) {
          return null;
        }
        return res.data.user;
      } catch (error) {
        return null;
      }
    },
    retry: false,
  });
};

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ fullName, username, email, password }) => {
      try {
        const res = await axios.post("/api/v1/users/register", {
          fullName,
          username,
          email,
          password,
        });
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
    mutationFn: async ({ identifier, password }) => {
      try {
        const res = await axios.post("/api/v1/users/login", {
          identifier,
          password,
        });
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
        const res = await axios.post("/api/v1/users/logout");
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
    mutationFn: async ({ identifier }) => {
      try {
        const res = await axios.post(
          `/api/v1/users/search?identifier=${identifier}`
        );
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

export const useGetSuggestedUser = () => {
  return useQuery({
    queryKey: ["SUGGESTED_USER"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/v1/users/suggested");
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data.suggestedUsers;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
  });
};

export const useGetUserByUsername = ({ username }) => {
  return useQuery({
    queryKey: ["USER_BY_USERNAME"],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/users/${username}`);
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

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axios.post(`/api/v1/users/follow/${id}`);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return true;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["USER_BY_USERNAME", "LOGGED_IN_USER"]);
    },
  });
};

export const useGetFollowingUser = (username) => {
  return useQuery({
    queryKey: ["FOLLOWING_USER"],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/users/following/${username}`);
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

export const useGetFollowersUser = (username) => {
  return useQuery({
    queryKey: ["FOLLOWERS_USER"],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/users/followers/${username}`);
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
    mutationFn: async ({ bio, avatar }) => {
      try {
        const res = await axios.put("/api/v1/users/update", {
          bio,
          avatar,
        });
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
