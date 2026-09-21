import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../api/tasks";
import { useAuth } from "../context/AuthContext";

function useTasksQuery() {
  const { user, token, isLoading: isAuthLoading } = useAuth();

  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    enabled: !isAuthLoading && !!user && !!token,
  });
}

export default useTasksQuery;
