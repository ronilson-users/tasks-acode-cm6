import plugin from "../plugin.json";

import React from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "./ErrorBoundary";
import App from "./App";
import { css } from "./style.js";

const COMMAND = "task-manager";
const BACK_ID = "task-manager-sheet";

class AcodePlugin {
  constructor() {
    this.baseUrl = "";
    this.root = null;
    this.overlay = null;
    this.styleEl = null;

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  async init() {
    // Estilos do plugin (uma única tag <style>, sem estilos inline)
    this.styleEl = document.createElement("style");
    this.styleEl.id = "task-manager-style";
    this.styleEl.textContent = css;
    document.head.append(this.styleEl);

    // Overlay + bottom sheet
    const overlay = document.createElement("div");
    overlay.id = "task-overlay";
    overlay.className = "tm-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Task Manager");

    const sheet = document.createElement("div");
    sheet.className = "tm-sheet";
    overlay.append(sheet);
    document.body.append(overlay);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) this.hide();
    });

    this.overlay = overlay;
    this.root = createRoot(sheet);
    this.root.render(
      <ErrorBoundary>
        <App baseUrl={this.baseUrl} onClose={this.hide} />
      </ErrorBoundary>
    );

    editorManager.editor.commands.addCommand({
      name: COMMAND,
      description: "Task Manager",
      bindKey: { win: "Ctrl-Shift-R" },
      exec: this.toggle,
    });
  }

  isOpen() {
    return !!this.overlay && this.overlay.classList.contains("is-open");
  }

  toggle() {
    this.isOpen() ? this.hide() : this.show();
  }

  show() {
    if (!this.overlay || this.isOpen()) return;
    this.overlay.classList.add("is-open");
    // Botão "voltar" do Android fecha o painel
    try {
      acode.require("actionStack").push({ id: BACK_ID, action: this.hide });
    } catch (e) {
      console.warn("[task-manager] actionStack indisponível", e);
    }
  }

  hide() {
    if (!this.overlay || !this.isOpen()) return;
    this.overlay.classList.remove("is-open");
    try {
      acode.require("actionStack").remove(BACK_ID);
    } catch (e) {
      /* já removido pelo próprio botão voltar */
    }
  }

  async destroy() {
    this.hide();
    try {
      editorManager.editor.commands.removeCommand(COMMAND);
    } catch (e) {
      console.warn("[task-manager] removeCommand falhou", e);
    }
    this.root?.unmount(); // o mesmo root criado no init
    this.root = null;
    this.overlay?.remove();
    this.overlay = null;
    this.styleEl?.remove();
    this.styleEl = null;
  }
}

if (window.acode) {
  const acodePlugin = new AcodePlugin();

  acode.setPluginInit(plugin.id, async (baseUrl) => {
    if (!baseUrl.endsWith("/")) baseUrl += "/";
    acodePlugin.baseUrl = baseUrl;
    await acodePlugin.init();
  });

  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}
