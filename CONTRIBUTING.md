# Contributing to First Strike Alert

Thank you for your interest in contributing to First Strike Alert! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/first-strike-alert.git
   cd first-strike-alert
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up your environment**:
   ```bash
   cp env.example .env
   # Edit .env with your CTFd details
   ```

## 🛠️ Development

### Running in Development Mode

```bash
npm run dev
```

This will start the server with nodemon, which automatically restarts when you make changes.

### Project Structure

```
├── server.js              # Main server file
├── index.html             # Frontend interface
├── static/
│   ├── css/styles.css     # Main stylesheet
│   ├── js/script.js       # Frontend JavaScript
│   ├── img/               # Images and graphics
│   ├── sounds/            # Audio files
│   └── fonts/             # Custom fonts
├── package.json           # Dependencies and scripts
└── README.md              # Documentation
```

## 🎨 Code Style

- Use **2 spaces** for indentation
- Use **camelCase** for JavaScript variables and functions
- Use **kebab-case** for CSS classes
- Add **comments** for complex logic
- Keep **functions small** and focused

### JavaScript Guidelines

```javascript
// Good
async function getFirstBloods() {
    try {
        const data = await ctfdApiRequest('/api/v1/submissions');
        return processFirstBloods(data);
    } catch (error) {
        console.error('Error fetching first bloods:', error);
        throw error;
    }
}

// Avoid
function getFirstBloods(){
var data=ctfdApiRequest('/api/v1/submissions');
return data;
}
```

### CSS Guidelines

```css
/* Good */
.announcement-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

/* Avoid */
.announcementScreen{
position:fixed;top:0;left:0;width:100%;height:100%;
}
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior**
4. **Actual behavior**
5. **Environment details** (OS, browser, Node.js version)
6. **Console errors** (if any)

### Bug Report Template

```markdown
**Bug Description**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Node.js: [e.g. 16.14.0]
```

## ✨ Feature Requests

For new features, please:

1. **Check existing issues** to avoid duplicates
2. **Describe the feature** clearly
3. **Explain the use case** and benefits
4. **Consider implementation** complexity

## 🔧 Pull Requests

### Before Submitting

- [ ] Test your changes thoroughly
- [ ] Update documentation if needed
- [ ] Follow the code style guidelines
- [ ] Add comments for complex logic
- [ ] Ensure no console errors

### Pull Request Process

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit:
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```

3. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** on GitHub

### Commit Message Format

Use clear, descriptive commit messages:

```
Add: new feature description
Fix: bug description
Update: change description
Remove: removed feature description
Docs: documentation changes
Style: formatting changes
```

## 🎯 Areas for Contribution

We welcome contributions in these areas:

### 🎨 Frontend Improvements
- New themes and color schemes
- Better responsive design
- Accessibility improvements
- Animation enhancements

### 🔧 Backend Features
- Additional CTFd API integrations
- Performance optimizations
- Better error handling
- New API endpoints

### 📚 Documentation
- Code comments
- API documentation
- Setup guides
- Troubleshooting guides

### 🧪 Testing
- Unit tests
- Integration tests
- Browser compatibility testing
- Performance testing

### 🎵 Audio/Visual
- New sound effects
- Visual themes
- Custom animations
- Graphics improvements

## 🔒 Security

If you discover a security vulnerability, please:

1. **Do NOT** open a public issue
2. **Email** the maintainer directly
3. **Provide** detailed information about the vulnerability
4. **Wait** for a response before disclosing publicly

## 📝 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤝 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Keep discussions on-topic

## 📞 Getting Help

If you need help:

1. Check the [README](README.md) first
2. Search existing [issues](https://github.com/yourusername/first-strike-alert/issues)
3. Create a new issue with the "question" label
4. Join our community discussions

Thank you for contributing! 🎉 