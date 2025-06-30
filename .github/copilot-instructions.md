<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# AI Dice Game - Copilot Instructions

This is a modular Vite-based dice game with AI personalities. The project follows these conventions:

## Project Structure
- `src/js/game/` - Core game logic, state management, dice mechanics
- `src/js/ai/` - AI personalities, chat responses, reactions
- `src/js/ui/` - DOM manipulation, event handlers, animations
- `src/js/utils/` - Utility functions, helpers, constants
- `src/styles/` - CSS modules and styling

## Coding Standards
- Use ES6+ modules and import/export syntax
- Prefer const/let over var
- Use descriptive function and variable names
- Add JSDoc comments for complex functions
- Keep functions focused on single responsibilities

## Game Architecture
- Game state is managed centrally in `game/gameState.js`
- AI personalities are defined in `ai/personalities.js`
- UI updates are handled through dedicated UI modules
- Event handling is separated from game logic

## AI Personalities
- Each AI has distinct personality traits and response patterns
- Responses are contextual based on game events
- Chat system supports real-time AI interactions
- AI decision-making follows their personality characteristics
