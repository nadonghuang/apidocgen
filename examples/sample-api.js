/**
 * 示例API服务 - 用户管理模块
 * 展示apidocgen的文档生成功能
 */

/**
 * @api GET /users
 * @name Get All Users
 * @description 获取用户列表，支持分页和过滤
 * @param {number} page 页码，从1开始，默认为1
 * @param {number} limit 每页数量，默认为10，最大100
 * @param {string} keyword 关键词过滤，可选
 * @returns {Array} 用户对象数组
 * @example
 * curl -X GET "http://localhost:3000/users?page=1&limit=20"
 * @example
 * fetch('/users?page=1&limit=10&keyword=john')
 */
async function getAllUsers(req, res) {
  const { page = 1, limit = 10, keyword } = req.query;
  
  // 实际实现会查询数据库
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];
  
  res.json({
    success: true,
    data: users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: users.length
    }
  });
}

/**
 * @api POST /users
 * @name Create User
 * @description 创建新用户
 * @param {string} name 用户姓名，必填
 * @param {string} email 用户邮箱，必填且格式正确
 * @param {string} password 用户密码，必填，至少8位
 * @param {boolean} isActive 是否激活，默认为true
 * @returns {Object} 创建成功的用户对象
 * @example
 * curl -X POST "http://localhost:3000/users" \\
 *   -H "Content-Type: application/json" \\
 *   -d '{"name":"Alice","email":"alice@example.com","password":"12345678"}'
 */
async function createUser(req, res) {
  const { name, email, password, isActive = true } = req.body;
  
  // 验证必填字段
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }
  
  // 创建用户逻辑
  const newUser = {
    id: Date.now(),
    name,
    email,
    isActive
  };
  
  res.status(201).json({
    success: true,
    data: newUser
  });
}

/**
 * @api GET /users/:id
 * @name Get User by ID
 * @description 根据用户ID获取用户详细信息
 * @param {number} id 用户ID，必填
 * @returns {Object} 用户对象
 * @example
 * curl -X GET "http://localhost:3000/users/123"
 */
async function getUserById(req, res) {
  const { id } = req.params;
  const user = { id: parseInt(id), name: 'John Doe', email: 'john@example.com' };
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
}

/**
 * @api PUT /users/:id
 * @name Update User
 * @description 更新用户信息
 * @param {number} id 用户ID，必填
 * @param {string} name 新的用户姓名，可选
 * @param {string} email 新的邮箱地址，可选
 * @param {boolean} isActive 激活状态，可选
 * @returns {Object} 更新后的用户对象
 * @example
 * curl -X PUT "http://localhost:3000/users/123" \\
 *   -H "Content-Type: application/json" \\
 *   -d '{"name":"John Updated","email":"john.new@example.com"}'
 */
async function updateUser(req, res) {
  const { id } = req.params;
  const { name, email, isActive } = req.body;
  
  // 查找用户并更新
  let user = { id: parseInt(id), name: 'John Doe', email: 'john@example.com' };
  
  if (name) user.name = name;
  if (email) user.email = email;
  if (typeof isActive !== 'undefined') user.isActive = isActive;
  
  res.json({
    success: true,
    data: user
  });
}

/**
 * @api DELETE /users/:id
 * @name Delete User
 * @description 删除用户
 * @param {number} id 用户ID，必填
 * @returns {Object} 删除结果
 * @example
 * curl -X DELETE "http://localhost:3000/users/123"
 */
async function deleteUser(req, res) {
  const { id } = req.params;
  
  // 模拟删除用户
  res.json({
    success: true,
    message: `User ${id} deleted successfully`
  });
}

/**
 * @api GET /users/:id/profile
 * @name Get User Profile
 * @description 获取用户的完整档案信息
 * @param {number} id 用户ID，必填
 * @returns {Object} 包含用户详细信息的档案对象
 * @example
 * curl -X GET "http://localhost:3000/users/123/profile"
 * 
 * 注意：此接口会返回用户的敏感信息，需要管理员权限
 */
async function getUserProfile(req, res) {
  const { id } = req.params;
  
  const userProfile = {
    id: parseInt(id),
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Full-stack developer with 5 years of experience',
    avatar: 'https://example.com/avatar.jpg',
    createdAt: '2023-01-01T00:00:00Z',
    lastLogin: '2024-01-15T10:30:00Z'
  };
  
  res.json({
    success: true,
    data: userProfile
  });
}

// 导出所有函数
module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile
};