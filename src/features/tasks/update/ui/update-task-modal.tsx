import { UiModal } from "@/shared/ui/ui-modal";
import { UiButton } from "@/shared/ui/ui-button";
import { Controller, useForm } from "react-hook-form";
import { UiTextField } from "@/shared/ui/ui-text-field";
import { useUpdateTask } from "../model/use-update-task";
import { UpdateTaskData, useTasks } from "@/entities/task";
import { UiSelect } from "@/shared/ui/ui-select-field";
import { useBoards } from "@/entities/board";
import { useCanViewBoardFn } from "@/features/board/view";

export function UpdateTaskModal({
  onClose,
  taskId,
}: {
  onClose: () => void;
  taskId: string;
}) {
  const task = useTasks((s) => s.getTaskById(taskId));

  const { control, handleSubmit } = useForm<UpdateTaskData>({
    defaultValues: task,
  });

  const { updateTask } = useUpdateTask(taskId);

  const { boards, getBoardById } = useBoards();

  // FIXME: перенести испорт фичи useCanViewBoardFn на слой выше
  const canViewBoard = useCanViewBoardFn();

  const onSubmit = handleSubmit((data) => updateTask(data, onClose));

  return (
    <UiModal isOpen onClose={onClose} width="md">
      <form onSubmit={onSubmit}>
        <UiModal.Header>
          <h1>Редактирование задачи</h1>
        </UiModal.Header>
        <UiModal.Body className="flex flex-col gap-4">
          <Controller
            control={control}
            name="title"
            rules={{ required: "Название доски - обязательное поле" }}
            render={({ field, fieldState }) => (
              <UiTextField
                label="Название"
                inputProps={{ ...field }}
                error={fieldState.error?.message}
              />
            )}
          />
        </UiModal.Body>
        <UiModal.Body className="flex flex-col gap-4">
          <Controller
            control={control}
            name="description"
            render={({ field, fieldState }) => (
              <UiTextField
                label="Описание"
                inputProps={{ ...field }}
                error={fieldState.error?.message}
                multiLine
              />
            )}
          />
        </UiModal.Body>

        <UiModal.Body className="flex flex-col gap-4">
          <Controller
            control={control}
            name="boardId"
            render={({ field: { value, onChange }, fieldState }) => {
              return (
                <UiSelect
                  label="Выбор доски"
                  error={fieldState.error?.message}
                  options={boards.filter((board) => canViewBoard(board.id))}
                  getLabel={(board) => board?.name ?? ""}
                  value={value ? getBoardById(value) : undefined}
                  onChange={(board) => {
                    onChange(board.id);
                  }}
                />
              );
            }}
          />
        </UiModal.Body>
        <UiModal.Footer>
          <UiButton type="button" variant="outlined" onClick={onClose}>
            Отмена
          </UiButton>
          <UiButton type="submit" variant="primary">
            Обновить
          </UiButton>
        </UiModal.Footer>
      </form>
    </UiModal>
  );
}
