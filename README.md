# Guiando App

Guiando App is a web application for managing and tracking requests, featuring user authentication, dynamic booking tables with filtering and pagination, and a modern responsive interface.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-GPL--3.0-green)

## Features

- **Responsive Dashboard**: Modern UI built with Bootstrap and SpruceSS
- **User Authentication**: Support for Auth0 integration
- **Dynamic Booking Management**: Filter and paginate through booking data
- **Interactive Interface**: Built with Alpine.js for reactive UI components
- **API Integration**: Structured data fetching with apiManager

## Tech Stack

- **Frontend Framework**: Bootstrap 5
- **JavaScript Libraries**:
  - Alpine.js for reactivity and DOM manipulation
  - jQuery for legacy support
  - Signature Pad for signature capture functionality
- **CSS Framework**: SpruceSS for styling
- **Build Tools**:
  - Webpack for module bundling
  - Handlebars for templating
  - SCSS for styling
  - Babel for JavaScript transpilation
- **Code Quality**:
  - ESLint for JavaScript linting
  - Stylelint for CSS/SCSS linting

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/guiando.git
   cd guiando/public
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. For production build:
   ```bash
   npm run build
   ```

## Project Structure

- **`src/`**: Source code
  - **`data/`**: Global configuration and data
  - **`helpers/`**: JavaScript helper functions
  - **`images/`**: Image assets
  - **`pages/`**: Handlebars page templates
  - **`partials/`**: Reusable Handlebars components
  - **`scripts/`**: JavaScript code
  - **`styles/`**: SCSS stylesheets

- **`build/`**: Compiled assets for production
- **`public/`**: Static assets and compiled code

## Authentication

The project supports Auth0 integration for user authentication. See the [Auth0 Integration Guide](auth0-integration-guide.md) for implementation details.

## Available Scripts

- **`npm start`**: Starts development server
- **`npm run build`**: Builds for production
- **`npm run lint:styles`**: Lints SCSS files
- **`npm run lint:scripts`**: Lints JavaScript files

## Recent Changes

See the [CHANGELOG.md](CHANGELOG.md) for detailed information about recent updates and changes.

## License

This project is licensed under the GNU General Public License, Version 3 (GPL-3.0). See the [LICENSE](LICENSE) file for more details.
