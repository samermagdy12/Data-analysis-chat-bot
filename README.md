# AI Data Analyst

An AI-powered data analysis chatbot that allows users to interact with datasets using natural language. Upload CSV or Excel files, ask questions about your data, and get instant insights powered by Groq's LLM.

## Overview

AI Data Analyst is a full-stack application that combines a modern React frontend with a FastAPI backend. It leverages large language models (LLM) to understand natural language queries about datasets and automatically executes the appropriate analysis tools to provide accurate answers.

**Problem Solved:** Users can now analyze data without writing code. Simply upload a dataset and ask questions in natural language—the AI handles all the data processing and analysis.

## Features

### ✨ Core Features
- **Natural Language Analysis** - Ask questions about your data in plain English
- **Dataset Upload** - Support for CSV, XLSX, and XLS files
- **Session Management** - Multiple concurrent sessions with persistent chat history
- **AI-Powered Insights** - Automatic tool selection and execution for data analysis
- **Tool Integration** - 13+ built-in AI tools for various analysis tasks

### 📊 Built-in Analysis Tools
- **Dataset Summary** - Overview of rows, columns, and data types
- **Descriptive Statistics** - Mean, median, standard deviation, quartiles, etc.
- **Missing Values Analysis** - Identify and analyze missing data
- **Duplicate Analysis** - Find duplicate rows in the dataset
- **Python Code Execution** - Execute custom Python code for advanced analysis
- **Statistical Tools** - Correlation analysis, distributions, etc.
- **Visualization Tools** - Generate charts (line, bar, scatter, pie, histogram, heatmap, box plots)

### 🎯 Real-Time Chat
- Conversational AI with continuous session history
- Tool execution with results fed back to the AI
- Intelligent response formatting and summarization
- Large payload handling and optimization

## Tech Stack

### Backend
- **Python 3.12+**
- **FastAPI** - Modern, fast web framework
- **Uvicorn** - ASGI server
- **Pandas** - Data manipulation and analysis
- **NumPy** - Numerical computing
- **Matplotlib** - Data visualization
- **OpenAI SDK** - Integration with Groq LLM API
- **Pydantic** - Data validation

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component library
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **Zustand** - State management
- **Framer Motion** - Animations
- **React Markdown** - Markdown rendering
- **Sonner** - Toast notifications

### DevOps & Tools
- **Docker** - Containerization (optional)
- **CORS** - Cross-origin request handling

## Project Architecture

```
project-root/
│
├── app/                           # Backend application
│   ├── main.py                    # FastAPI entry point
│   ├── config.py                  # Configuration & environment
│   ├── llm.py                     # LLM integration
│   ├── prompts.py                 # System prompts
│   ├── session.py                 # Session management
│   ├── dataset.py                 # Dataset handling
│   ├── executor.py                # Python code execution
│   ├── validator.py               # Data validation
│   ├── tools.py                   # Tool configuration
│   │
│   ├── routes/                    # API endpoints
│   │   ├── chat.py                # Chat endpoint
│   │   ├── upload.py              # File upload endpoint
│   │   └── sessions.py            # Session management endpoints
│   │
│   ├── services/                  # Business logic
│   │   ├── chat_service.py        # Chat service
│   │   └── upload_service.py      # Upload service
│   │
│   ├── tools/                     # AI tool implementations
│   │   ├── manager.py             # Tool registration
│   │   ├── dataset_tools.py       # Dataset analysis tools
│   │   ├── python_tool.py         # Python execution
│   │   ├── statistics_tools.py    # Statistics tools
│   │   └── charts/                # Visualization tools
│   │
│   └── utils/                     # Utility functions
│       └── json_utils.py          # JSON helpers
│
├── UI/                            # Frontend application
│   ├── src/                       # React source code
│   ├── public/                    # Static assets
│   ├── package.json               # Frontend dependencies
│   ├── vite.config.ts             # Vite configuration
│   ├── tailwind.config.js         # Tailwind configuration
│   └── tsconfig.json              # TypeScript configuration
│
├── uploads/                       # Uploaded file storage
│
├── requirements.txt               # Python dependencies
├── .env.example                   # Environment template
├── .gitignore                     # Git exclusions
└── README.md                      # This file
```

## Installation

### Prerequisites
- Python 3.12 or higher
- Node.js 18 or higher
- npm or yarn
- Git

### Backend Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/samermagdy12/Data-analysis-chat-bot.git
cd Data-analysis-chat-bot
```

#### 2. Create and Activate Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 3. Install Backend Dependencies
```bash
pip install -r requirements.txt
```

#### 4. Create Environment Configuration
Create a `.env` file in the project root (use `.env.example` as template):
```bash
cp .env.example .env
```

#### 5. Add Your Groq API Key
Edit `.env` and add your Groq API key:
```env
GROQ_API_KEY=your_groq_api_key_here
```

**Get a Groq API Key:**
1. Visit https://console.groq.com
2. Create an account or log in
3. Generate an API key
4. Copy it to your `.env` file

#### 6. Run the Backend Server
```bash
uvicorn app.main:app --reload
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

#### 1. Install Frontend Dependencies
```bash
cd UI
npm install
```

#### 2. Run Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

#### 3. Build for Production
```bash
npm run build
```

## Environment Variables

Create a `.env` file in the project root with the following configuration:

```env
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here
```

**Important:** Never commit the `.env` file to version control. It's in `.gitignore` by default.

### How to Get Your Groq API Key

1. Visit [Groq Console](https://console.groq.com)
2. Create an account or log in with your existing account
3. Navigate to API keys section
4. Generate a new API key
5. Copy the key and add it to your `.env` file:
   ```
   GROQ_API_KEY=your_actual_key_here
   ```

## API Endpoints

### Chat API
**POST** `/api/chat`

Send a message and receive analysis based on the uploaded dataset.

Request:
```json
{
  "session_id": "uuid-string",
  "message": "What is the average value in the dataset?"
}
```

Response:
```json
{
  "answer": "The average value is...",
  "success": true,
  "message": "Analysis completed",
  "result": {...},
  "chart": null,
  "metadata": {}
}
```

### Upload API
**POST** `/api/upload`

Upload a CSV or Excel file to create a new session.

Request: `multipart/form-data` with file field

Response:
```json
{
  "session_id": "uuid-string",
  "filename": "data.csv",
  "rows": 1000,
  "columns": 5,
  "summary": {...}
}
```

### Sessions API
**GET** `/api/sessions`

List all active sessions.

Response:
```json
{
  "sessions": [
    {
      "session_id": "uuid-string",
      "filename": "data.csv",
      "rows": 1000,
      "columns": 5,
      "message_count": 10
    }
  ]
}
```

**GET** `/api/sessions/{session_id}/history`

Get chat history for a session.

**DELETE** `/api/sessions/{session_id}`

Delete a session and its data.

## Usage

### Basic Workflow

1. **Upload Dataset**
   - Go to the web interface
   - Click "Upload Dataset"
   - Select a CSV or Excel file
   - The system creates a new session

2. **Create/Select Session**
   - Each upload creates a unique session ID
   - Session stores the dataset and chat history
   - Multiple sessions can run in parallel

3. **Ask Questions**
   - Type your question in natural language
   - Examples:
     - "What are the column names?"
     - "Show me the average of numeric columns"
     - "Create a line chart of sales over time"
     - "What are the missing values?"

4. **AI Analyzes Dataset**
   - The LLM selects appropriate analysis tools
   - Tools execute Python code, generate statistics, create visualizations
   - Results are formatted and sent back to the AI

5. **Receive Results**
   - Answer displayed in natural language
   - Charts rendered inline
   - Metadata and error messages shown when applicable

### Example Queries
- "What does this dataset contain?"
- "Show me the distribution of prices"
- "Create a bar chart comparing categories"
- "Calculate the correlation between variables"
- "What are the duplicate rows?"
- "Perform a statistical analysis"

## Supported File Formats
- CSV (.csv)
- Excel (.xlsx, .xls)

Maximum file size depends on available memory (typically up to several hundred MB).

## Troubleshooting

### API Key Error
```
OpenAIError: Missing credentials...
```
**Solution:** Ensure `GROQ_API_KEY` is set in `.env` file.

### Import Errors
```
ModuleNotFoundError: No module named 'fastapi'
```
**Solution:** Ensure virtual environment is activated and dependencies installed:
```bash
pip install -r requirements.txt
```

### Connection Refused (Frontend to Backend)
**Solution:** Ensure backend is running on `http://localhost:8000`

### File Upload Issues
**Solution:** 
- Check file format is CSV or Excel
- Ensure file is not corrupted
- Try a smaller test file first

## Future Improvements

- [ ] Database persistence (replace in-memory session storage)
- [ ] User authentication and authorization
- [ ] Multi-user collaboration features
- [ ] Custom prompt templates
- [ ] Advanced filtering and search
- [ ] Export results (PDF, Excel, JSON)
- [ ] Dataset versioning
- [ ] Query result caching
- [ ] More visualization types
- [ ] Mobile app
- [ ] Docker containerization
- [ ] CI/CD pipeline

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

**Developed by Samer Magdy**

- GitHub: https://github.com/samermagdy12
- Project: https://github.com/samermagdy12/Data-analysis-chat-bot

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ using FastAPI, React, and Groq LLM**
