import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../api/tasks";

function useTasksQuery() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
}

export default useTasksQuery;
