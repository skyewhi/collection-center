/**
 * 网站配置文件
 * 修改此处来设置访问密码等参数
 */
const SITE_CONFIG = {
  // 访问密码（前端校验，安全性有限，请勿存放敏感内容）
  password: 'mycollection2026',

  // 密码会话有效期（小时），超过后需重新输入
  sessionHours: 720, // 约30天

  // 站点名称
  siteName: '我的收藏中心',

  // 数据文件路径
  dataPath: 'data/collections.json',

  // 是否允许来源限制（留空则不限制）
  // 填写允许的来源域名，如 ['https://yourdomain.com']
  allowedOrigins: [],
};
