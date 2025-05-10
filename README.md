# Report Card Website

This is a web application for generating and managing report cards. It is built using modern web technologies like React, TypeScript, and TailwindCSS.

## Features

- **Dynamic Report Cards**: Create and view report cards dynamically.
- **Theme Toggle**: Switch between light and dark themes.
- **Responsive Design**: Optimized for mobile and desktop devices.
- **Supabase Integration**: Backend services powered by Supabase.
- **PDF Export**: Generate and download report cards as PDFs.

## Project Structure

The project is organized as follows:

```
public/         # Static assets like favicon, robots.txt
src/            # Main source code
  components/   # Reusable UI components
  hooks/        # Custom React hooks
  integrations/ # External service integrations (e.g., Supabase)
  lib/          # Utility functions
  pages/        # Page components
  services/     # Business logic and API services
  types/        # TypeScript type definitions
supabase/       # Supabase configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Dev-091/report_card.git
   cd report-card
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

### Building for Production

To build the project for production:
```bash
npm run build
# or
yarn build
```

The output will be in the `dist/` directory.

### Linting and Formatting

To lint and format the code:
```bash
npm run lint
npm run format
# or
yarn lint
yarn format
```

## Configuration

### Supabase

1. Update the Supabase configuration in `supabase/config.toml`.
2. Ensure your Supabase project is set up and running.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Author
Developed by **Dev-091**.

