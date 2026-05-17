# Contributing to Fans Support Guide

Thank you for your interest in contributing! This project is an open-source boilerplate, and your help makes it better for everyone.

## 🚀 Getting Started

1.  **Fork the Repository**: Create your own copy of the project.
2.  **Clone Locally**:
    ```bash
    git clone https://github.com/your-username/fans-support-guide.git
    cd fans-support-guide
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Setup Environment**:
    - Copy `.env.example` to `.env`.
    - Add your own Firebase and Google Sheets credentials for testing.
    - **NEVER** commit your `.env` file. It is already ignored by Git.

## 🛠️ Development Workflow

1.  **Create a Branch**:
    ```bash
    git checkout -b feature/your-feature-name
    ```
2.  **Run Dev Server**:
    ```bash
    npm run dev
    ```
3.  **Build Check**: Before submitting, ensure the project builds correctly:
    ```bash
    npm run build
    ```

## 📝 Pull Request Guidelines

- All changes should be submitted via a **Pull Request** to the `develop` branch.
- Use the provided PR template to describe your changes.
- Ensure your code follows the project's style (Astro, TypeScript).
- If you add a new component or feature, please update the documentation in the `README.md` or `i18n` dictionary if applicable.

## 🛡️ Security

If you discover a security vulnerability, please report it via the repository's security tab or open an issue if it doesn't expose sensitive keys.

Happy coding! ⚽
