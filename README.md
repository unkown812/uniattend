#  UNIAttend

An intelligent and user-friendly cross-platform attendance app built with **React Native + Expo**. Developed to simplify attendance management for students and educators with modern UI, offline support, and flexible syncing.

---

##  Features

- **Easy to Use** – Easy to use and Simple and Modern Attractive UI.
- **Intuitive Design** – Clean architecture with reusable components, contexts, hooks, and utility modules.
- **Configurable Subjects** – Add, edit, or remove subjects easily via dedicated schema (`fix-subjects-schema.sql`).
- **Modular and Scalable** – Built with TypeScript for maintainability, and structured to accommodate future enhancements.
- **Fast Development** – Built on Expo platform—run instantly on the web, Android emulator, or iOS simulator with live reload.

---

##  Project Structure

```
uniattend/
├── .vscode/                 Visual Studio Code configuration
├── app/                     Main app source (screens, routing, UI)
├── assets/                  Images and static assets
├── components/              Reusable UI components
├── constants/               App-level constants (colors, sizes, etc.)
├── context/                 React Context providers (state management)
├── hooks/                   Reusable custom React hooks
├── scripts/                 Utility or build-related scripts
├── types/                   TypeScript type definitions
├── utils/                   Helper functions and utilities
├── .env                     Environment variables (gitignored)
├── image.png                Preview or screenshot of the app
├── package.json             Project dependencies and scripts
├── tsconfig.json            TypeScript configuration
└── README.md                ← You're here!
```

---

##  Getting Started

### Prerequisites
- **Node.js** (v14+ recommended)
- **npm** or **yarn**
- **Expo CLI** (install globally via `npm install -g expo-cli`)

---

### Installation & Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/unkown812/uniattend.git
cd uniattend

# 2. Install dependencies
npm install
# or
yarn install

# 3. Start the app
npx expo start
```

Choose one of the available options:
- **Android Emulator**
- **iOS Simulator**
- **Expo Go** (scan QR on your device)
- **Web Browser** (via `w` key)

---

##  Managing Subjects Schema

Need to update or reset the subjects data schema? Apply the included SQL script:

```bash
# Execute in your SQLite/PostgreSQL/MySQL client or via CLI
\i fix-subjects-schema.sql
```

This ensures your database remains in sync with the latest schema design.

---

##  Contributing

We welcome contributions! Here’s how to get started:

1. Fork the repository  
2. Create a feature branch: `git checkout -b feature/YourFeature`  
3. Commit your changes: `git commit -am "Add some feature"`  
4. Push to the branch: `git push origin feature/YourFeature`  
5. Open a Pull Request—we’d love to review it!

---

##  Roadmap

- [ ] Attendance reports and analytics
- [ ] Push notifications for reminders
- [ ] User authentication flow
- [ ] Cloud backup & multi-device sync
- [ ] Dark mode / theme toggle support

---

##  Acknowledgments

- Built on top of **Expo**—thank you for the instant development experience.
- Inspired by other open-source attendance apps and best practices.

---

##  License

Distributed under the **MIT License**. See `LICENSE` for more.

---

##  Contact / Support

Got questions, ideas, or feedback? Feel free to open an issue or reach out via GitHub Discussions. Let's build the future of attendance tracking together!
