<script setup></script>

<template>
  <div class="login-container">
    <div class="logo">BackGround</div>
    <div class="form">
      <h3>人力资源管理系统</h3>
      <a-card class="login-card"> 登录表单 </a-card>
    </div>
  </div>
</template>

<style lang="less">
.login-container {
  display: flex;
  height: 100vh;

  .logo {
    flex: 7;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(111, 98, 242, 0.1);
  }
  .form {
    flex: 3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .ant-card {
      width: 320px;
      border: none;
      padding: 0;
    }
    h3 {
      padding-left: 30px;
      font-size: 24px;
    }
  }
}
</style>
