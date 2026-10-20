// Todo o CSS do plugin. Segue as cores do tema do Acode (--primary-color / --primary-text-color).
// Os resets usam :where() (especificidade zero) para não anular as classes .tm-*.
export const css = `
.tm-overlay{
  --tm-text:var(--primary-text-color,#e9ecf1);
  --tm-bg:var(--primary-color,#666782);
  --tm-line:#616161;
  --tm-fill:rgba(102,104,115,.09);
  --tm-fill-2:rgba(127,127,127,.22);
  --tm-accent:#07abff;
  --tm-on-accent:#424e9c;
  --tm-do:#ff6b6b;
  --tm-delegate:#f5a524;
  --tm-drop:#8b93a1;
  --tm-ok:#34c77b;
  position:fixed;inset:0;z-index:100;
  display:flex;align-items:flex-end;justify-content:center;
  background:rgba(0,0,0,.5);
  opacity:0;visibility:hidden;
  transition:opacity .2s ease,visibility 0s linear .26s;
}
.tm-overlay.is-open{opacity:1;visibility:visible;transition:opacity .2s ease}

.tm-sheet{
  width:100%;max-width:560px;
  height:min(86vh,720px);
  display:flex;flex-direction:column;
  background:var(--tm-bg);color:var(--tm-text);
  border-radius:20px 20px 0 0;
  box-shadow:0 -8px 32px rgba(0,0,0,.35);
  font:14px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  transform:translateY(100%);
  transition:transform .26s cubic-bezier(.2,.8,.2,1);
}
@supports (height:1dvh){.tm-sheet{height:min(86dvh,720px)}}
.tm-overlay.is-open .tm-sheet{transform:none}

/* resets (especificidade zero) */
:where(.tm-overlay) *{box-sizing:border-box}
:where(.tm-overlay) button{
  font:inherit;color:inherit;background:none;border:0;margin:0;padding:0;
  box-shadow:none;cursor:pointer;text-align:inherit;-webkit-tap-highlight-color:transparent;
}
:where(.tm-overlay) :is(h2,h3,p,ul){margin:0;padding:0}
:where(.tm-overlay) ul{list-style:none}
.tm-root :focus-visible{outline:2px solid var(--tm-accent);outline-offset:2px}

.tm-root{display:flex;flex-direction:column;flex:1;min-height:0}

/* cabeçalho */
.tm-grab{flex:none;width:40px;height:4px;margin:8px auto 0;border-radius:2px;background:var(--tm-fill-2)}
.tm-head{flex:none;display:flex;align-items:center;gap:10px;padding:10px 12px 12px 16px}
.tm-logo{width:28px;height:28px;border-radius:5px}
.tm-titles{flex:1;min-width:0}
.tm-title{font-size:18px;font-weight:700;letter-spacing:-.01em;line-height:1.2}
.tm-caption{font-size:12px;opacity:.7}

/* abas */
.tm-tabs{
  flex:none;display:grid;grid-template-columns:repeat(3,1fr);gap:4px;
  margin:0 16px 4px;padding:4px;border-radius:10px;background:var(--tm-fill);
}
.tm-tab{
  display:flex;align-items:center;justify-content:center;gap:6px;
  min-height:38px;border-radius:9px;font-weight:600;opacity:.7;
}
.tm-tab[aria-selected="true"]{background:var(--tm-fill-2);opacity:1}

.tm-body{
  flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;
  padding:12px 16px calc(20px + env(safe-area-inset-bottom,0px));
}

/* campos e botões */
.tm-field{
  width:100%;min-width:0;margin:0;padding:10px 12px;
  font:inherit;color:inherit;background:var(--tm-fill);
  border:1px solid var(--tm-line);border-radius:6px;outline:none;
}
.tm-field:focus{border-color:var(--tm-accent)}
.tm-field::placeholder{color:inherit;opacity:.5}
textarea.tm-field{min-height:96px;resize:vertical}

.tm-btn{
  display:inline-flex;align-items:center;justify-content:center;gap:6px;flex:none;
  min-height:40px;padding:0 14px;border-radius:6px;font-weight:600;background:var(--tm-fill-2);
}
.tm-btn--primary{background:var(--tm-accent);color:var(--tm-on-accent)}
.tm-btn--sm{min-height:34px;padding:0 10px;font-size:13px}

.tm-icon-btn{
  flex:none;width:36px;height:36px;border-radius:6px;
  display:grid;place-items:center;font-size:18px;opacity:.8;
}
.tm-icon-btn:active{background:var(--tm-fill-2)}
.tm-icon-btn--sm{width:32px;height:32px;font-size:16px}
.tm-flip{transform:rotate(180deg)}

.tm-add{display:flex;gap:8px;margin-bottom:12px}

/* lista */
.tm-list>li+li{margin-top:10px}
.tm-empty{padding:28px 8px;text-align:center;opacity:.7}

.tm-card{padding:12px;border:1px solid var(--tm-line);border-radius:14px;background:var(--tm-fill)}
.tm-row{display:flex;align-items:center;gap:8px}
.tm-name{flex:1;min-width:0;font-size:15px;font-weight:600;overflow-wrap:anywhere}
.tm-card.is-done .tm-name{text-decoration:line-through;opacity:.6}

.tm-check{
  flex:none;width:24px;height:24px;border-radius:50%;
  border:2px solid var(--tm-line);display:grid;place-items:center;font-size:14px;
}
.tm-check[aria-checked="true"]{background:var(--tm-ok);border-color:var(--tm-ok);color:#06210f}
.tm-check--sm{width:20px;height:20px;font-size:12px}
.tm-check--xs{width:16px;height:16px;font-size:11px;border-width:1.5px}
.tm-checkitem[aria-checked="true"] .tm-check--xs{background:var(--tm-ok);border-color:var(--tm-ok);color:#06210f}

.tm-meta{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:10px 0 0 32px}
.tm-count{display:inline-flex;align-items:center;gap:6px;margin-left:auto;font-size:12px;opacity:.75}
.tm-bar{height:4px;margin:10px 0 0 32px;border-radius:2px;background:var(--tm-fill-2);overflow:hidden}
.tm-bar>i{display:block;height:100%;background:var(--tm-accent);transition:width .25s ease}

/* chips urgente / importante */
.tm-chips{display:flex;flex-wrap:wrap;gap:6px}
.tm-chip{
  display:inline-flex;align-items:center;gap:5px;
  padding:5px 10px;border:1px solid var(--tm-line);border-radius:999px;
  font-size:12px;font-weight:600;opacity:.8;
}
.tm-chip[aria-pressed="true"]{opacity:1}
.tm-chip--urgent[aria-pressed="true"]{color:var(--tm-do);border-color:var(--tm-do);background:rgba(255,107,107,.14)}
.tm-chip--important[aria-pressed="true"]{color:var(--tm-accent);border-color:var(--tm-accent);background:rgba(7,171,255,.14)}

/* subtarefas */
.tm-subs{margin-top:12px;padding-top:12px;border-top:1px solid var(--tm-line)}
.tm-sublist>li+li{margin-top:8px}
.tm-sub{padding:8px 8px 8px 10px;border:1px solid var(--tm-line);border-radius:6px;background:var(--tm-fill)}
.tm-sub-name{flex:1;min-width:0;font-size:14px;overflow-wrap:anywhere}
.tm-sub-name.is-done,.tm-checkitem .is-done{text-decoration:line-through;opacity:.6}

.tm-note{
  display:block;width:100%;margin-top:6px;padding:8px 10px;border-radius:8px;
  background:var(--tm-fill);font-size:13px;white-space:pre-wrap;overflow-wrap:anywhere;opacity:.9;
}
.tm-note.is-clamped{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}

.tm-edit{margin-top:8px}
.tm-hint{margin:6px 0 8px;font-size:12px;opacity:.75}
.tm-actions{display:flex;flex-wrap:wrap;gap:8px}

.tm-checklist{margin-top:6px}
.tm-checkitem{display:flex;align-items:center;gap:8px;width:100%;padding:6px 2px;font-size:13px}

/* matriz */
.tm-lead{margin:0 0 12px;font-size:13px;opacity:.8}
.tm-matrix{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.tm-quad{
  --q:var(--tm-drop);
  min-width:0;min-height:130px;padding:10px;
  border:1px solid var(--tm-line);border-radius:14px;background:var(--tm-fill);
}
.tm-quad--do{--q:var(--tm-do)}
.tm-quad--delegate{--q:var(--tm-delegate)}
.tm-quad--plan{--q:var(--tm-accent);border-color:var(--tm-accent);background:rgba(7,171,255,.12)}
.tm-quad-head{display:flex;align-items:center;gap:6px}
.tm-dot{flex:none;width:8px;height:8px;border-radius:50%;background:var(--q)}
.tm-quad-title{font-size:14px;font-weight:700}
.tm-focus{
  margin-left:auto;padding:2px 8px;border-radius:999px;
  background:var(--tm-accent);color:var(--tm-on-accent);font-size:11px;font-weight:700;
}
.tm-quad-hint{margin:2px 0 8px;font-size:11px;opacity:.7}
.tm-quad-empty{padding:4px 0;font-size:12px;opacity:.6}

.tm-mt{margin-top:6px}
.tm-mt-btn{
  display:flex;align-items:flex-start;justify-content:space-between;gap:6px;
  width:100%;padding:8px;border-radius:8px;background:var(--tm-fill);font-size:13px;
}
.tm-mt-name{
  overflow-wrap:anywhere;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
}
.tm-mt-name--full{display:block;margin-bottom:6px;font-size:13px}
.tm-mt-meta{flex:none;font-size:11px;opacity:.7;padding-top:1px}
.tm-mt .tm-chips{padding:8px 0 2px}

.tm-tray{margin-bottom:12px;padding:10px;border:1px dashed var(--tm-line);border-radius:14px}
.tm-footnote{margin-top:12px;font-size:12px;opacity:.65;text-align:center}

/* sort / reorder toolbar */
.tm-toolbar{display:flex;gap:8px;margin-bottom:12px}
.tm-select{flex:1;min-width:0}
.tm-btn[aria-pressed="true"]{background:var(--tm-accent);color:var(--tm-on-accent)}
.tm-icon-btn:disabled{opacity:.25;cursor:default}

/* due date status on task cards */
.tm-due-line{margin:8px 0 0 32px}
.tm-due{
  display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border-radius:999px;
  background:var(--tm-fill);font-size:12px;font-weight:600;
}
.tm-due--overdue,.tm-due--late{color:var(--tm-do);background:rgba(255,107,107,.14)}
.tm-due--today,.tm-due--soon{color:var(--tm-delegate);background:rgba(245,165,36,.14)}
.tm-due--ontime{color:var(--tm-ok);background:rgba(52,199,123,.14)}

/* task details: rename, due date, timestamps */
.tm-details{display:grid;gap:12px;margin-top:12px;padding-top:12px;border-top:1px solid var(--tm-line)}
.tm-details + .tm-subs{margin-top:12px}
.tm-label{display:block;margin-bottom:4px;font-size:12px;opacity:.75}
.tm-date-row{display:flex;align-items:center;gap:6px}
.tm-stamps{display:flex;flex-wrap:wrap;gap:4px 16px;margin:0;font-size:12px;opacity:.8}
.tm-stamps div{display:flex;gap:6px}
.tm-stamps dt{opacity:.8}
.tm-stamps dd{margin:0;font-weight:600}

/* calendar */
.tm-cal-head{display:flex;align-items:center;gap:6px;margin-bottom:8px}
.tm-cal-title{flex:1;font-size:16px;font-weight:700;letter-spacing:-.01em}
.tm-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.tm-weekday{padding:6px 0;text-align:center;font-size:11px;opacity:.65}
.tm-day{
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  min-height:44px;border-radius:6px;background:var(--tm-fill);font-size:14px;
}
.tm-day.is-today{box-shadow:inset 0 0 0 1.5px var(--tm-accent)}
.tm-day.is-selected{background:var(--tm-accent);color:var(--tm-on-accent);font-weight:700}
.tm-day-ind{width:5px;height:5px;border-radius:50%;background:var(--tm-accent)}
.tm-day-ind--overdue{background:var(--tm-do)}
.tm-day-ind--done{background:var(--tm-ok)}
.tm-day.is-selected .tm-day-ind{background:var(--tm-on-accent)}
.tm-day.is-selected .tm-day-ind--overdue{background:var(--tm-do);box-shadow:0 0 0 1px var(--tm-on-accent)}

.tm-agenda{margin-top:16px}
.tm-agenda-title{margin-bottom:8px;font-size:15px;font-weight:700}
.tm-agenda-list>li+li{margin-top:6px}
.tm-agenda-row{
  display:flex;align-items:center;gap:10px;width:100%;padding:8px 10px;
  border:1px solid var(--tm-line);border-radius:6px;background:var(--tm-fill);
}
.tm-agenda-name{flex:1;min-width:0;overflow-wrap:anywhere}
.tm-agenda-row.is-done .tm-agenda-name{text-decoration:line-through;opacity:.6}
.tm-overdue{margin-bottom:14px;padding:10px;border:1px solid var(--tm-do);border-radius:10px;background:rgba(255,107,107,.08)}

/* in-plugin date picker (the native one ignores the theme) */
.tm-picker-btn{display:flex;align-items:center;gap:8px;text-align:left}
.tm-picker{margin-top:10px;padding:10px;border:1px solid var(--tm-line);border-radius:10px;background:var(--tm-fill)}
.tm-picker .tm-chips{margin-bottom:10px}
.tm-picker .tm-cal-head{margin-bottom:6px}
.tm-picker .tm-cal-title{font-size:14px}
.tm-picker .tm-day{min-height:38px;font-size:13px;background:var(--tm-fill)}
.tm-chip--pick[aria-pressed="true"]{color:var(--tm-accent);border-color:var(--tm-accent);background:rgba(7,171,255,.14)}

.tm-due--none{background:transparent;border:1px dashed var(--tm-line);font-weight:500;opacity:.8}

/* urgent suggestion */
.tm-suggest{
  display:flex;align-items:center;gap:8px;margin:8px 0 0 32px;padding:6px 6px 6px 10px;
  border-radius:8px;background:rgba(255,107,107,.1);color:var(--tm-do);font-size:12px;font-weight:600;
}
.tm-suggest span{flex:1;min-width:0}
.tm-suggest .tm-btn{color:var(--tm-text)}
.tm-suggest--compact{margin:6px 0 0}

/* "Do now" turns red while it has open tasks */
.tm-quad--do.is-alert{border-color:var(--tm-do);background:rgba(255,107,107,.12)}
.tm-alert-badge{
  margin-left:auto;min-width:20px;padding:1px 7px;border-radius:999px;
  background:var(--tm-do);color:#2a0606;font-size:11px;font-weight:700;text-align:center;
}

/* erro */
.tm-error{padding:20px;display:flex;flex-direction:column;gap:10px;color:var(--tm-text)}
.tm-error-stack{max-height:160px;overflow:auto;padding:10px;border-radius:8px;background:var(--tm-fill);font-size:11px;white-space:pre-wrap}

@media (prefers-reduced-motion:reduce){
  .tm-overlay,.tm-sheet,.tm-bar>i{transition:none}
}
`;
