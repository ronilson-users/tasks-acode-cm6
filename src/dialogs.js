// Usa o diálogo nativo do Acode; cai para window.confirm fora do app.
export async function confirmAction(title, message) {
  try {
    const confirm = window.acode?.require("confirm");
    if (confirm) return !!(await confirm(title, message));
  } catch (e) {
    console.warn("[task-manager] confirm do Acode indisponível", e);
  }
  return window.confirm(`${title}\n${message}`);
}
