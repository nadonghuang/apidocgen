<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"/>
  <img src="https://img.shields.io/badge/Zero_Deps-✅-success?style=for-the-badge" alt="Zero Deps"/>
</p>

<h1 align="center">🚀 apidocgen</h1>

<p align="center">
  <strong>Zero-dependency API documentation generator from code comments — beautiful HTML docs in seconds</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-installation">Install</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-license">License</a>
</p>

---

## ✨ Features

- 🚀 **Zero Dependencies** — Pure Node.js, no external packages needed
- 🎯 **Smart Parsing** — Automatically extracts API info from JSDoc comments
- 🎨 **Beautiful HTML** — Professional, responsive documentation output
- 📋 **Rich Support** — Handles endpoints, parameters, returns, examples, and notes
- ⚡ **Lightning Fast** — Processes large codebases in seconds
- 🔧 **CLI Ready** — Command-line interface with flexible options
- 📱 **Responsive Design** — Works perfectly on all devices
- 🎯 **Accurate Detection** — Identifies HTTP methods, paths, and function signatures

## 📦 Installation

```bash
npm install -g apidocgen
```

Or use npx:
```bash
npx apidocgen
```

## 🚀 Usage

### Basic Usage

Generate documentation from a single file:
```bash
apidocgen src/api.js
```

### With Custom Output

Specify output file location:
```bash
apidocgen src/api.js --output docs/index.html
```

### Using Different Templates

```bash
apidocgen src/api.js --template modern
```

### Processing Whole Directories

```bash
apidocgen ./src --output docs/api-docs.html
```

### Piping from stdin

```bash
cat src/api.js | apidocgen --output docs/index.html
```

### Real Example

```bash
# Generate docs from sample API
apidocgen examples/sample-api.js --output docs/sample-docs.html

# Open the generated documentation
open docs/sample-docs.html
```

## 📁 Project Structure

```
apidocgen/
├── src/                 # Core source code
│   └── index.js        # Main parser logic
├── bin/                # CLI entry point
│   └── cli.js          # Command-line interface
├── examples/           # Usage examples
│   └── sample-api.js   # Sample API definitions
├── README.md          # This file
├── LICENSE             # MIT License
├── package.json        # Project configuration
└── .gitignore          # Git ignore rules
```

## 📋 API Comment Format

apidocgen recognizes specially formatted JSDoc comments:

```javascript
/**
 * @api GET /users
 * @name Get All Users
 * @description Retrieve a list of all users with pagination
 * @param {number} page - Page number (1-based), default: 1
 * @param {number} limit - Items per page, default: 10, max: 100
 * @param {string} keyword - Search filter, optional
 * @returns {Array} Array of user objects
 * @example
 * curl -X GET "http://localhost:3000/users?page=1&limit=20"
 * @example
 * fetch('/users?page=1&limit=10')
 */
async function getAllUsers(req, res) {
  // Implementation
}
```

### Supported Tags

- `@api` — HTTP method and path (required)
- `@name` — API endpoint name
- `@description` — Detailed description
- `@param` — Parameter definitions
- `@returns` — Return type and description
- `@example` — Usage examples
- Regular text descriptions are automatically captured

### Supported HTTP Methods

- `GET`
- `POST`
- `PUT`
- `DELETE`
- `PATCH`
- `HEAD`
- `OPTIONS`

## 🎨 Generated Documentation Features

The generated HTML documentation includes:

- **Beautiful Interface** — Clean, modern design with hover effects
- **Method Badges** — Color-coded HTTP method indicators
- **Parameter Tables** — Detailed parameter information with types
- **Example Sections** — Code examples with syntax highlighting
- **Responsive Layout** — Works on desktop, tablet, and mobile
- **Search Ready** — Structured for easy integration with search
- **Export Friendly** — Clean HTML that's easy to customize

## 🔧 Configuration

### Environment Variables

```bash
# Set default output directory
export APIDOCGEN_OUTPUT_DIR="./docs"

# Set default template
export APIDOCGEN_TEMPLATE="modern"
```

### Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `--output` | Output file path | `docs/index.html` |
| `--template` | Template name | `default` |
| `--help` | Show help information | - |

## 🚀 Development

### Running Tests

```bash
npm test
```

### Building from Source

```bash
git clone https://github.com/nadonghuang/apidocgen.git
cd apidocgen
npm install
npm link
```

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with ⚡ by <a href="https://github.com/nadonghuang">nadonghuang</a>
  <br/>
  <sub>If you find this useful, please give it a ⭐!</sub>
</p>