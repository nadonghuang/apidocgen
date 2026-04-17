#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');

// 简单的命令行解析器，不依赖commander
const args = process.argv.slice(2);
const inputPath = args.find(arg => !arg.startsWith('-'));
const outputPath = args.find(arg => arg.startsWith('--output='))?.split('=')[1];
const template = args.find(arg => arg.startsWith('--template='))?.split('=')[1] || 'default';

if (!inputPath) {
  console.error('❌ Error: Please provide input path');
  console.log('Usage: apidocgen <input-path> [--output=output.html] [--template=template]');
  process.exit(1);
}

console.log('🚀 Starting API documentation generator...');
console.log(`📁 Input: ${inputPath}`);
console.log(`📄 Output: ${outputPath || 'docs/index.html'}`);
console.log(`🎨 Template: ${template}`);

try {
  const code = fs.readFileSync(inputPath, 'utf8');
  const docs = parseAPIDocuments(code);
  const html = generateHTML(docs, template);
  
  const output = outputPath || path.join(path.dirname(inputPath), 'docs', 'index.html');
  fs.writeFileSync(output, html);
  
  console.log(`✅ Success! Documentation generated at: ${output}`);
  console.log(`📊 Found ${docs.length} API endpoints`);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

/**
 * 从代码中解析API文档注释
 */
function parseAPIDocuments(code) {
  const apiDocs = [];
  const lines = code.split('\n');
  let currentDoc = null;
  let inBlockComment = false;
  let commentBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 检测块注释开始
    if (line.trim().startsWith('/**')) {
      inBlockComment = true;
      commentBuffer = [line];
      continue;
    }
    
    // 检测块注释结束
    if (inBlockComment && line.trim().endsWith('*/')) {
      commentBuffer.push(line);
      inBlockComment = false;
      
      const comment = commentBuffer.join('\n');
      const apiInfo = extractAPIInfo(comment, lines, i);
      if (apiInfo) {
        apiDocs.push(apiInfo);
      }
      
      commentBuffer = [];
      continue;
    }
    
    // 在块注释中收集内容
    if (inBlockComment) {
      commentBuffer.push(line);
    }
  }

  return apiDocs;
}

/**
 * 从注释中提取API信息
 */
function extractAPIInfo(comment, lines, commentEndIndex) {
  const apiInfo = {
    name: '',
    description: '',
    method: '',
    path: '',
    parameters: [],
    returns: '',
    examples: [],
    notes: []
  };

  // 解析注释内容
  const commentLines = comment.split('\n').slice(1, -1); // 去掉 /** 和 */
  
  commentLines.forEach(line => {
    const trimmed = line.trim();
    
    // @api 标记
    if (trimmed.startsWith('@api')) {
      const parts = trimmed.split(' ');
      if (parts[1]) apiInfo.method = parts[1].toUpperCase();
      if (parts[2]) apiInfo.path = parts[2];
    }
    
    // @name 标记
    else if (trimmed.startsWith('@name')) {
      apiInfo.name = trimmed.replace('@name', '').trim();
    }
    
    // @description 标记
    else if (trimmed.startsWith('@description')) {
      apiInfo.description = trimmed.replace('@description', '').trim();
    }
    
    // @param 标记
    else if (trimmed.startsWith('@param')) {
      const paramMatch = trimmed.match(/@param\s+(\w+)\s+(.+)?/);
      if (paramMatch) {
        apiInfo.parameters.push({
          name: paramMatch[1],
          type: paramMatch[2] || 'any',
          required: !trimmed.includes('[optional]')
        });
      }
    }
    
    // @returns 标记
    else if (trimmed.startsWith('@returns')) {
      const returnMatch = trimmed.match(/@returns\s+(.+)?/);
      if (returnMatch) {
        apiInfo.returns = returnMatch[1] || 'any';
      }
    }
    
    // @example 标记
    else if (trimmed.startsWith('@example')) {
      apiInfo.examples.push(trimmed.replace('@example', '').trim());
    }
    
    // 普通描述文本
    else if (trimmed && !trimmed.startsWith('@')) {
      if (!apiInfo.description && apiInfo.name) {
        apiInfo.description = trimmed;
      } else if (apiInfo.name && apiInfo.description) {
        apiInfo.notes.push(trimmed);
      }
    }
  });

  // 如果没有找到API标记，返回null
  if (!apiInfo.method || !apiInfo.path) {
    return null;
  }

  // 尝试从代码中获取更多信息
  const codeAfterComment = lines.slice(commentEndIndex + 1, commentEndIndex + 10).join('\n');
  const functionMatch = codeAfterComment.match(/function\s+(\w+)\s*\(/) || 
                       codeAfterComment.match(/const\s+(\w+)\s*=\s*(async\s+)?\s*\(/);
  
  if (functionMatch && !apiInfo.name) {
    apiInfo.name = functionMatch[1];
  }

  return apiInfo;
}

/**
 * 生成HTML文档
 */
function generateHTML(apiDocs, template) {
  const timestamp = new Date().toLocaleString('zh-CN');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 30px;
        }
        .header {
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .title {
            color: #007bff;
            margin: 0;
            font-size: 2.5rem;
            font-weight: bold;
        }
        .subtitle {
            color: #666;
            margin: 10px 0 0 0;
            font-size: 1.1rem;
        }
        .api-endpoint {
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            margin-bottom: 20px;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        .api-endpoint:hover {
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }
        .endpoint-header {
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .method {
            background: rgba(255,255,255,0.2);
            padding: 4px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.9rem;
            text-transform: uppercase;
            min-width: 60px;
            text-align: center;
        }
        .method.GET { background: rgba(40, 167, 69, 0.8); }
        .method.POST { background: rgba(220, 53, 69, 0.8); }
        .method.PUT { background: rgba(255, 193, 7, 0.8); }
        .method.DELETE { background: rgba(220, 53, 69, 0.8); }
        .method.PATCH { background: rgba(108, 117, 125, 0.8); }
        .path {
            font-family: 'Courier New', monospace;
            font-size: 1.1rem;
            flex: 1;
        }
        .endpoint-content {
            padding: 20px;
        }
        .description {
            margin-bottom: 15px;
            line-height: 1.6;
        }
        .parameters, .returns {
            margin: 15px 0;
        }
        .parameters h4, .returns h4 {
            color: #007bff;
            margin-bottom: 10px;
            font-size: 1.1rem;
        }
        .parameter-row {
            display: flex;
            gap: 15px;
            margin-bottom: 8px;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 4px;
        }
        .param-name {
            font-weight: bold;
            font-family: 'Courier New', monospace;
            color: #007bff;
            min-width: 120px;
        }
        .param-type {
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 0.9rem;
            font-family: 'Courier New', monospace;
        }
        .required {
            color: #dc3545;
            font-size: 0.8rem;
        }
        .example {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 15px;
            margin-top: 10px;
        }
        .example h4 {
            color: #28a745;
            margin: 0 0 10px 0;
        }
        .example code {
            background: #fff;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        .notes {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 15px;
            margin-top: 15px;
        }
        .notes h4 {
            color: #856404;
            margin: 0 0 10px 0;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            color: #666;
            font-size: 0.9rem;
        }
        .stats {
            background: #e8f4fd;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 20px;
            text-align: center;
        }
        .stats h3 {
            color: #007bff;
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">🚀 API Documentation</h1>
            <p class="subtitle">Auto-generated from code comments • ${timestamp}</p>
        </div>

        <div class="stats">
            <h3>📊 Overview</h3>
            <p>Found <strong>${apiDocs.length}</strong> API endpoints</p>
        </div>

        ${apiDocs.map(doc => generateEndpointHTML(doc)).join('')}

        <div class="footer">
            <p>Generated with ❤️ by <strong>apidocgen</strong> • Zero-dependency API documentation generator</p>
        </div>
    </div>
</body>
</html>`;
}

/**
 * 生成单个API端点的HTML
 */
function generateEndpointHTML(doc) {
  return `
<div class="api-endpoint">
    <div class="endpoint-header">
        <span class="method ${doc.method}">${doc.method}</span>
        <span class="path">${doc.path}</span>
    </div>
    <div class="endpoint-content">
        ${doc.name ? `<h3>📝 ${doc.name}</h3>` : ''}
        ${doc.description ? `<p class="description">${doc.description}</p>` : ''}
        
        ${doc.parameters.length > 0 ? `
            <div class="parameters">
                <h4>📋 Parameters</h4>
                ${doc.parameters.map(param => `
                    <div class="parameter-row">
                        <span class="param-name">${param.name}</span>
                        <span class="param-type">${param.type}</span>
                        ${param.required ? '<span class="required">Required</span>' : ''}
                    </div>
                `).join('')}
            </div>
        ` : ''}
        
        ${doc.returns ? `
            <div class="returns">
                <h4>📤 Returns</h4>
                <p><code>${doc.returns}</code></p>
            </div>
        ` : ''}
        
        ${doc.examples.length > 0 ? `
            <div class="examples">
                <h4>💡 Examples</h4>
                ${doc.examples.map(example => `
                    <div class="example">
                        <h4>Request</h4>
                        <code>${example}</code>
                    </div>
                `).join('')}
            </div>
        ` : ''}
        
        ${doc.notes.length > 0 ? `
            <div class="notes">
                <h4>📌 Notes</h4>
                ${doc.notes.map(note => `<p>${note}</p>`).join('')}
            </div>
        ` : ''}
    </div>
</div>`;
}