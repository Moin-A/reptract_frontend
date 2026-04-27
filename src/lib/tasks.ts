import { type Task } from "@/components/dashboard/TaskItem";

const MOCK_TASKS: Task[] = [
  { id: 1, name: "My first Task",        due: "6 days late — was due Apr 16 at 12:00 AM", overdue: true,  badge: "Lunch",   badgeColor: "#6AAF5E", badgeTextColor: "white", done: false },
  { id: 2, name: "Follow up with Priya", due: "Due today at 3:00 PM",                     overdue: false, badge: "Call",    badgeColor: "#2F6FEB", badgeTextColor: "white", done: false },
  { id: 3, name: "Review Q2 proposal",   due: "Due Apr 25",                               overdue: false, badge: "Meeting", badgeColor: "#7C3AED", badgeTextColor: "white", done: false },
];

export async function getTasks(): Promise<Task[]> {
  return MOCK_TASKS;
}
