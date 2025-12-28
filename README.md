# TaskFlow Pro

**TaskFlow Pro** is a modern Kanban management suite designed to streamline productivity through intelligent automation and fluid design. Built with React 19 and Framer Motion, it features a deep integration with Google's Gemini 2.0 Flash AI to transform high-level goals into actionable task flows.



## Key Features

* **AI Integration:** Powered by **Gemini 2.0 Flash**, TaskFlow Pro breaks down complex tasks into professional sub-tasks with one click.
* **Live Stats Dashboard:** Monitor your workflow at a glance with real-time tracking of priorities, completion rates, and total workload.
* **Fluid Kanban Experience:** Drag-and-drop mechanics with physics-based animations via Framer Motion.
* **Activity & History Log:** A dedicated history sidebar records every completion, deletion, and bulk action for full accountability.
* **Milestone Celebrations:** Interactive confetti triggers when tasks are moved to the "Done" column.
* **Data Persistence:** Full LocalStorage integration ensures your board and history survive page refreshes.

## Tech Stack

- **Core:** React 19 (Hooks & Functional Components)
- **AI:** Google Generative AI SDK (Gemini 2.0 Flash)
- **Animation:** Framer Motion
- **Styling:** Tailwind CSS (Custom Dark/Glassmorphism Theme)
- **Visuals:** Canvas Confetti



## Quick Start

1. **Clone the Repo**
   ```bash
   git clone (https://github.com/AsiraDonzel/taskflow-pro.git)
   cd taskflow-pro
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Launch**
   ```bash
   npm run dev
   ```

## Future Integrations
- Multi-User Sync: Firebase integration for collaborative boards.
- Labels & Tags: Custom color-coded labels for different workstreams.
- Dark/Light Mode: Full theme customization.

## License
MIT License - feel free to use this for your own projects!

## Note
If you clone the repo, create a folder called services and place the geminiServices.ts file in there.
