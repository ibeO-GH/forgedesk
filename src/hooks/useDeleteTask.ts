import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "../api/tasks";

function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}

export default useDeleteTask;
