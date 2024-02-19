<script setup>
import { useRouter } from 'vue-router'  // 引入方法
import { loginAPI, getUserInfoAPI, getUserBaseInfoAPI } from '@/api/login'
import useToken from '@/stores/token'
import useUserInfo from '@/stores/userInfo'
const router = useRouter() // 得到一个router实例

const loginForm = reactive({
  // 手机号、密码 、是否同意
  mobile: '13800000002',
  password: 'hm#qd@23!',
  isAgree: true,
})
// 自定义校验规则 rule是当前的规则 value是当前的值
const validatorAgree = (rule, value) => {
  // 判断 value 是不是 true  如果不是 true 就报错
  return value ? Promise.resolve() : Promise.reject(new Error('您必须同意用户协议'))
}
// 验证规则
const rules = {
  mobile: [
    { required: true, message: '手机号不能为空', trigger: ['change', 'blur'] },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '手机号格式不正确',
      trigger: ['change', 'blur'],
    },
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: ['change', 'blur'],
    },
    {
      pattern: /^.{6,}$/,
      message: '密码长度必须大于6位',
      trigger: ['change', 'blur'],
    },
  ],
  isAgree: [
    { validator: validatorAgree },
  ],
}
let loading = ref(false)
// 提交表单
const onFinish = async (values) => {
  try {
    loading.value = true
    const { updateToken } = useToken()
    // values 是校验表单的数据
    const data = await loginAPI(values)
    updateToken(data)  // 更新 pinia 里面的 token
    await getUserInfo()
    loading.value = false

    // 登录成功 要跳转到主页
    router.push("/")
  } catch (error) {
    console.log(error, 'error')
    loading.value = false
  }
}
// 获取用户信息
const getUserInfo = async () => {
  const profile = await getUserInfoAPI()
  const data = await getUserBaseInfoAPI(profile.userId)
  const { updateUserInfo, addAuthorizedRoutes } = useUserInfo()
  data.profile = profile
  updateUserInfo({ ...data, roles: profile.roles })

  // 根据权限添加路由
  addAuthorizedRoutes()
}
;
</script>

<template>
  <div class="login-container">
    <div class="logo">BackGround</div>
    <div class="form">
      <h3>人力资源管理系统</h3>
      <a-card class="login-card">
        <a-form :model="loginForm" :rules="rules" @finish="onFinish" autocomplete="off">
          <a-form-item name="mobile">
            <a-input size="large" v-model:value="loginForm.mobile"></a-input>
          </a-form-item>
          <a-form-item name="password">
            <a-input-password size="large" v-model:value="loginForm.password"></a-input-password>
          </a-form-item>
          <a-form-item name="isAgree">
            <a-checkbox v-model:checked="loginForm.isAgree">用户平台使用协议</a-checkbox>
          </a-form-item>
          <a-form-item>
            <a-button size="large" type="primary" block htmlType="submit" :loading="loading">登录</a-button>
          </a-form-item>
        </a-form>
      </a-card>
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
