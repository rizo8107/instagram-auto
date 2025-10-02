import {
  getAllAutomation,
  getAutomationInfo,
  getProfilePosts,
} from "@/actions/automation";
import { onUserInfo } from "@/actions/user";
import { useQuery } from "@tanstack/react-query";

export const useQueryAutomation = () => {
  return useQuery({
    queryKey: ["user-automation"],
    queryFn: getAllAutomation,
  });
};

export const useQueryAutomations = (id: string) => {
  return useQuery({
    queryKey: ["automation-info"],
    queryFn: () => getAutomationInfo(id),
  });
};

export const useQueryUser = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: onUserInfo,
  });
};

export const useQueryAutomationPosts = () => {
  const fetchPosts = async () => await getProfilePosts();

  return useQuery({
    queryKey: ["instagram-media"],
    queryFn: fetchPosts,
  });
};
