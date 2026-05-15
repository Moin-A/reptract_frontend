import { Task, TaskItem } from "@/components/molecules/TaskItem";
import { Pagination } from "@/components/ui/Pagination";

type BucketPagination = { page_no: number; total_items: number; per_page: number };

type Props = {
  bucket: string;
  taskList: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onTaskClick: () => void;
  onEdit?: (id: number) => void;
  paginationInfo?: BucketPagination;
  onPageChange?: (page: number) => void;
};

export const TaskBucket = ({ bucket, taskList, onToggle, onDelete, onTaskClick, onEdit, paginationInfo, onPageChange }: Props) => (
  <div>
    {taskList.length > 0 && <h4>{bucket}</h4>}
    {taskList.map((task, j) => (
      <TaskItem
        key={task.id}
        onEdit={onEdit}
        task={task}
        onToggle={onToggle}
        onDelete={onDelete}
        isLast={j === taskList.length - 1}
        onClick={onTaskClick}
      />
    ))}
    {paginationInfo && onPageChange && (
      <Pagination
        currentPage={paginationInfo.page_no}
        totalItems={paginationInfo.total_items}
        perPage={paginationInfo.per_page}
        onChange={onPageChange}
      />
    )}
  </div>
);
