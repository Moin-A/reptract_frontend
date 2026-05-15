"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { DashboardSection }   from "@/components/molecules/DashboardSection";
import { GhostButton }        from "@/components/molecules/PageHeader";
import { TaskBucket }         from "@/components/molecules/TaskBucket";
import CollapsibleForm        from "@/components/molecules/CollapsibleForm";
import { useDashboard }       from "@/components/organisms/dashboard/DashboardContext";
import { type Task }          from "@/components/molecules/TaskItem";

type BucketPagination = { page_no: number; total_items: number; per_page: number };
type PaginationMap = Record<string, BucketPagination>;

export function DashboardTasks() {
  const { tasks, setTasks, activeTab, setActiveTab } = useDashboard();

  const [formOpen,    setFormOpen]    = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [pagination,  setPagination]  = useState<PaginationMap>({});
  const [pages,       setPages]       = useState<Record<string, number>>({});

  const fetchTasks = useCallback((bucketPages: Record<string, number> = {}) => {
    const params = new URLSearchParams();
    for (const [bucket, page] of Object.entries(bucketPages)) {
      params.set(bucket, String(page));
    }

    fetch(`/api/tasks?${params}`, { credentials: "include" })
      .then(res => res.json())
      .then((data: { buckets: { [key: string]: Task[] }; pagination?: PaginationMap }) => {
        setTasks(data.buckets);
        if (data.pagination) {
          setPagination(data.pagination);
          setPages(prev => {
            const updated: Record<string, number> = {};
            for (const [bucket, info] of Object.entries(data.pagination!)) {
              updated[bucket] = prev[bucket] ?? info.page_no;
            }
            return updated;
          });
        }
      });
  }, [setTasks]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  function toggleTask(id: number) {
    setTasks(prev =>
      Object.fromEntries(
        Object.entries(prev).map(([bucket, list]) => [
          bucket,
          list.map(t => t.id === id ? { ...t, done: !t.done } : t),
        ])
      )
    );
  }

  async function deleteTask(id: number) {
    setTasks(prev =>
      Object.fromEntries(
        Object.entries(prev).map(([bucket, list]) => [
          bucket,
          list.filter(t => t.id !== id),
        ])
      )
    );
    await fetch(`/api/tasks/${id}`, { method: "DELETE", credentials: "include" });
  }

  function handleEdit(id: number) {
    const task = Object.values(tasks).flat().find(t => t.id === id);
    if (!task) return;
    setEditingTask(task);
    setFormOpen(true);
  }

  function handlePageChange(bucket: string, page: number) {
    const newPages = { ...pages, [bucket]: page };
    setPages(newPages);
    fetchTasks(newPages);
  }

  return (
    <DashboardSection
      title="My Tasks"
      action={
        activeTab === "Tasks" && (
          <GhostButton icon={<Plus size={14} />} label="Add task" onClick={() => setFormOpen(true)} />
        )
      }
      formSlot={
        activeTab === "Tasks" && (
          <CollapsibleForm
            open={formOpen}
            editingTask={editingTask}
            onClose={() => { setFormOpen(false); setEditingTask(null); }}
          />
        )
      }
    >
      {Object.entries(tasks).map(([bucket, taskList]) => (
        <TaskBucket
          key={bucket}
          bucket={bucket}
          taskList={taskList}
          onEdit={handleEdit}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onTaskClick={() => setActiveTab("Tasks")}
          paginationInfo={pagination[bucket]}
          onPageChange={(page) => handlePageChange(bucket, page)}
        />
      ))}
    </DashboardSection>
  );
}
