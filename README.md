# ⏱️ Pixel Time Tracker

A retro-styled time tracking application with pixel art aesthetics, built with React and Firebase.

## 🎨 About

I created this time tracker to help manage my tasks with an interface I would like. 
Unlike traditional timers or Pomodoro apps, this works as a **stopwatch** - perfect for tracking real work sessions without time pressure.

## ✨ Key Features

- **Custom Labels**: Create and organize tasks with custom category labels (e.g., "thesis", "cleaning", "coding")
- **Multi-label Support**: Assign multiple labels to a single task
- **Flexible Tracking**:
    - Start/pause/stop tasks as needed
    - Multiple tasks can be paused simultaneously
    - Only one task runs at a time
    - View current session time and total accumulated time
- **Session History**:
    - View all completed sessions grouped by day/week/month
    - Track time spent per category
    - Statistics overview
    - Edit or delete past entries
- **Customizable Themes**:
    - Background colors: Black, White, Gray
    - Accent colors: Purple, Blue, Green, Red, Yellow, Dark
    - Adjustable screen brightness
- **Smart Label Sorting**: Recently used and recently created labels appear first
- **Auto-cleanup**: Logs older than 6 months are automatically removed

## 🚀 How It Works

1. **Create Labels**: Add custom categories for your tasks
2. **Select & Start**: Choose one or more labels and start tracking
3. **Track Time**: The app shows current session time and cumulative total time for tasks with the same labels
4. **Pause/Resume**: Pause tasks and resume them later - all paused tasks are preserved
5. **Complete**: Stop a task to save it to your log history
6. **Review**: View your activity logs grouped by time period with detailed statistics

## 🛠️ Tech Stack

- **Frontend**: React with Hooks
- **Styling**: Tailwind CSS with pixel art aesthetics
- **Authentication**: Firebase Auth (Google Sign-in)
- **Database**: Cloud Firestore
- **Hosting**: GitHub Pages

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/krovostcora/pixel-time-tracker.git
cd pixel-time-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your Firebase configuration to `.env`:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

5. Set up Firebase:
    - Create a project at [Firebase Console](https://console.firebase.google.com/)
    - Enable Google Authentication
    - Create a Firestore database
    - Add these Firestore rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                      request.auth.uid == request.resource.data.userId;
    }
  }
}
```

6. Run locally:
```bash
npm start
```

## 🎮 Usage Tips

- Labels are sorted by most recently used, making frequent tasks easy to access
- Use meaningful label combinations to track complex projects
- The "Total Time" feature helps you see cumulative progress across multiple sessions
- Group logs by week or month to see bigger picture trends
- Adjust brightness for comfortable viewing in different lighting conditions

## 🔐 Privacy & Security

- All data is stored in your personal Firebase database
- Only you can access your tasks and logs
- Firebase credentials are stored in environment variables (not in the code)
- Logs are automatically cleaned up after 6 months

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Made with 💜 and pixel vibes