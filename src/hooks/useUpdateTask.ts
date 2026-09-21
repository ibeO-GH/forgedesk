import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../api/tasks";
import type { Task } from "../types/task";

function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      title,
      priority,
    }: {
      taskId: string;
      title: string;
      priority: Task["priority"];
    }) => updateTask(taskId, { title, priority }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}

export default useUpdateTask;
