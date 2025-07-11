// functions/.eslintrc.js
module.exports = {
  root: true,              // บอก ESLint หยุดไต่ config ข้างบน
  env: {
    node: true,            // กำหนดเป็น Node.js env
    es2020: true,
  },
  extends: [
    "eslint:recommended"   // ใช้กฎมาตรฐาน JS
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    // ใส่กฎเพิ่มเติมตามต้องการ
  }
};
