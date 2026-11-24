import api from "./api";

// Colors a person can pick for a new label
export const STATUS_COLORS = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#14b8a6", "#3b82f6", "#a78bfa", "#ec4899"];

// Custom labels of every project (filled by MyTasks on load, kept in sync here)
export const CUSTOM_STATUSES = [];

const toStatus = (s) => ({
  id: s.id, project_id: s.project_id, value: s.key, label: s.label,
  color: s.color, bg: `${s.color}22`, custom: true,
});

export function setCustomStatuses(list) {
  CUSTOM_STATUSES.length = 0;
  (list || []).forEach((s) => CUSTOM_STATUSES.push(toStatus(s)));
}

export const customFor = (projectId) => CUSTOM_STATUSES.filter((s) => s.project_id === projectId);

const notify = (detail) => window.dispatchEvent(new CustomEvent("statuses:changed", { detail }));

export async function createStatus(projectId, { label, color }) {
  const { data } = await api.post(`/projects/${projectId}/statuses`, { label, color });
  const st = toStatus(data.status);
  CUSTOM_STATUSES.push(st);
  notify({});
  return st;
}

export async function deleteStatus(id) {
  const { data } = await api.delete(`/project-statuses/${id}`);
  const i = CUSTOM_STATUSES.findIndex((s) => s.id === id);
  if (i >= 0) CUSTOM_STATUSES.splice(i, 1);
  notify({ deleted: data.key });
}
