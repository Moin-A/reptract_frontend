import { Task, TaskItem } from "@/components/dashboard/TaskItem";

type Props = {
  bucket: string;
  taskList: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onTaskClick: () => void;
};

export const TaskBucket = ({ bucket, taskList, onToggle, onDelete, onTaskClick }: Props) => (
  <div key={bucket}>
    {taskList.length > 0 && <h4>{bucket}</h4>}
    {taskList.map((task, j) => (
      <TaskItem
        key={task.id}
        task={task}
        onToggle={onToggle}
        onDelete={onDelete}
        isLast={j === taskList.length - 1}
        onClick={onTaskClick}
      />
    ))}
  </div>
);
