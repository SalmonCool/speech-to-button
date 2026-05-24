# Speech to Button

A desktop application that maps voice commands to keyboard inputs. Built with Electron, Vosk speech recognition, and robotjs.

## How It Works

The app uses a node-based visual editor where you create and connect two types of nodes:

- **Mic Nodes (red)** — Listen for a specific trigger word using your microphone
- **Button Nodes (blue)** — Simulate a keyboard key press when triggered

Connect a mic node to a button node by dragging a wire from the mic's output port to a button node. When the mic detects its trigger word, all connected button nodes fire their assigned key press. Key presses are sent at the OS level, so they work even when the app is in the background.

## Features

- Vosk offline speech recognition (no internet required)
- OS-level key simulation via robotjs
- Drag-and-drop node editor with wire connections
- Debug panel with keyboard visualizer and live transcript
- Save/load configurations as XML files
- Frameless window with custom controls

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- C++ build tools for robotjs (Visual Studio Build Tools on Windows)
- A microphone

## Setup

```bash
# Clone the repo
git clone https://github.com/SalmonCool/speech-to-button.git
cd speech-to-button

# Install dependencies
npm install

# Download and extract the Vosk model
curl -L -o vosk-model-small-en-us-0.15.zip https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip
# Extract the zip into the project root (creates vosk-model-small-en-us-0.15/ folder)

# Package the model for the app
tar -czf model.tar.gz vosk-model-small-en-us-0.15

# Run the app
npm start
```

## Usage

1. Click the **microphone icon** in the toolbar to spawn a mic node
2. Click the **down arrow icon** to spawn a button node
3. Type a trigger word in the mic node's text field (e.g. "fire")
4. Type a key name in the button node's text field (e.g. "space", "a", "enter")
5. Toggle the button node **on** (green) by clicking its center icon
6. Drag a wire from the mic node's white output port to the button node
7. Toggle the mic node **on** (green) to start listening
8. Say the trigger word — the assigned key will be pressed

### Key Names

Key names follow robotjs format: `a`-`z`, `0`-`9`, `space`, `enter`, `tab`, `escape`, `up`, `down`, `left`, `right`, `f1`-`f12`, `shift`, `control`, `alt`

### Saving and Loading

- Click the **save icon** to save your current node layout and connections
- Click the **load icon** to open a previously saved configuration
- Saves are stored as XML files in the `saves/` folder
