import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "../api/tasks";
import type { Task } from "../types/task";

function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      status,
    }: {
      taskId: string;
      status: Task["status"];
    }) => updateTaskStatus(taskId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}

export default useUpdateTaskStatus;
