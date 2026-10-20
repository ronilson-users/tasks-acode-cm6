<div style="align:center">
  <img src="https://raw.githubusercontent.com/ronilson-users/tasks-acode-cm6/main/assets/icon.png" alt="tasks icon" height="150" width="150" align="center" style="border:1px solid #fffffff9; margin:4px; border-radius:2px;" />

</div>

# Task Manager Acode

A task and subtask management plugin built to be fast, intuitive and productive. Integrated directly into Acode, it lets you organize your workflow with lists, a calendar and the classic Eisenhower Matrix.

## 🛠️ Tech Stack

- **React**: Main library for building the interface.
- **React Icons (Lucide)**: Modern, lightweight icons.
- **CSS Custom Properties**: For full integration with the Acode theme.
- **LocalStorage**: For local, offline data persistence.

## ✨ Features

<p align="center"><sub>← Swipe sideways to see all screenshots →</sub></p>

<div style="display:flex; overflow-x:auto; scroll-snap-type:x mandatory; gap:12px; border:1px solid #ccc; border-radius:12px; padding:8px;">

  <figure style="flex:0 0 100%; scroll-snap-align:center; margin:0; text-align:center;">

<img src="https://raw.githubusercontent.com/ronilson-users/tasks-acode-cm6/main/assets/tasks1.jpg" alt="tasks icon" height="350" width="420" style="margin:4px; border-radius:2px;" />
    <figcaption>1/4 · Provider picker</figcaption>
  </figure>

  <figure style="flex:0 0 100%; scroll-snap-align:center; margin:0; text-align:center;">
<img src="https://raw.githubusercontent.com/ronilson-users/tasks-acode-cm6/main/assets/tasks2.jpg" alt="tasks icon" height="350" width="420" style="margin:4px; border-radius:2px;" />
    <figcaption>2/4 · Live model list</figcaption>
  </figure>
  
  <figure style="flex:0 0 100%; scroll-snap-align:center; margin:0; text-align:center;">
<img src="https://raw.githubusercontent.com/ronilson-users/tasks-acode-cm6/main/assets/tasks3.jpg" alt="tasks icon" height="350" width="420" style="margin:4px; border-radius:2px;" />
    <figcaption>3/4 · Live model list</figcaption>
  </figure>
  
  <figure style="flex:0 0 100%; scroll-snap-align:center; margin:0; text-align:center;">
<img src="https://raw.githubusercontent.com/ronilson-users/tasks-acode-cm6/main/assets/tasks3.jpg" alt="tasks icon" height="350" width="420" style="margin:4px; border-radius:2px;" />
    <figcaption>4/4 · Live model list</figcaption>
  </figure>

</div>

### **1. Core Task Management**

- **Three View Modes:**
  - **List:** Classic, sortable view.
  - **Calendar:** Track tasks by due date.
  - **Matrix:** Organize by urgency and importance (Eisenhower).
- **Quick Edit:** Edit the task name directly on the card with the pencil button, without opening complex menus.
- **Due Dates:** Add deadlines with a native calendar picker (which respects the Acode theme).
- **Overdue Alerts:** Clear visual indicators for tasks that are "Overdue", "Due today" or "Done on time".
- **Automatic Progress:** The main task status updates automatically as its subtasks are completed.

### **2. Eisenhower Matrix (Focus)**

- Classify tasks as **Urgent** (fire icon) and **Important** (star icon).
- The plugin automatically sorts tasks into four quadrants: _Do now, Schedule, Delegate,_ and _Eliminate_.
- Smart suggestion: tasks with approaching due dates prompt you to mark them as urgent.

### **3. Organization and Sorting**

- Sort your tasks by: Manual Order, Due Date, Newest, Oldest or Name (A-Z).
- **Reorder Mode:** Toggle the reorder button to easily move tasks up and down.

### **4. Advanced Subtasks**

- Create checklists inside each task.
- Add custom **Notes** to each subtask.
- **Magic Checklist Generation:** Type notes using the format `# Text.` and the plugin automatically converts them into checklist items.

### **5. Persistence and UI**

- **Auto-Save:** Everything is saved in Acode's `localStorage`, so you never lose anything when closing the app.
- **Adaptive Interface:** _Bottom sheet_ design that blends seamlessly with Acode's light/dark theme.
- **Quick Shortcut:** Press `Ctrl+Shift+R` to open or close the task manager instantly.

## 🚀 How to Use

1. Install the plugin in Acode.
2. Press `Ctrl+Shift+R` (or use the command palette) to open the Task Manager.
3. Type the task name in the top field and press Enter.
4. Tap the icons to add dates, mark tasks as urgent/important, or open the details to add subtasks.

## 📦 Changelog
### **v1.1.1 (Current)**
ajust readm
### **v1.1.0**


- **New Views:** Added Calendar and Eisenhower Matrix tabs.
- **Layout Improvement:** The task name edit field was moved to an action button (pencil) next to the title, saving vertical space on the card.
- **Date System:** Added support for due dates with overdue alerts.
- **Sorting:** New toolbar to sort and reorder tasks.
- **UI/UX:** Improved card design, progress bars and theme integration.

### **v1.0.3**

- General layout improvements.
- Added the Task Matrix tab.

### **v1.0.2**

- Bug fixes and stability improvements.

### **v1.0.1**

- Initial release of the task manager with subtask and notes support.


