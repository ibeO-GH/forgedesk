import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../api/tasks";

function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      title,
      priority,
    }: {
      title: string;
      priority: "low" | "medium" | "high";
    }) => createTask(title, priority),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}

export default useCreateTask;
