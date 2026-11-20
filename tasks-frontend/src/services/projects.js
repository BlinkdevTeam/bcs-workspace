import api from "./api";

const PALETTE = ["#3b82f6", "#22c55e", "#facc15", "#f97316", "#a78bfa", "#ec4899"];

function hashIndex(str, mod) {
  const v = str || "";
  let h = 0;
  for (let i = 0; i < v.length; i++) h = (h * 31 + v.charCodeAt(i)) >>> 0;
  return h % mod;
}

// Same project name always gets the same color, everywhere in the app
export const projectColor = (name) => PALETTE[hashIndex(name, PALETTE.length)];

// Creates a project, then tells the rest of the app (sidebar, My Tasks) to reload.
// Throws on failure so the form can show the error.
export async function createProject(form) {
  const { data } = await api.post("/projects", {
    name:        form.name.trim(),
    description: form.description.trim() || null,
    start_date:  form.start_date || null,
    end_date:    form.end_date || null,
  });
  window.dispatchEvent(new Event("projects:changed"));
  return data.project;
}
