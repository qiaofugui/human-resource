import {
  HomeOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PoweroffOutlined,
  LockOutlined,
  UserOutlined,
  InsuranceOutlined,
  TransactionOutlined,
  AuditOutlined,
  FundViewOutlined,
  TeamOutlined,
  PartitionOutlined,
  ApartmentOutlined,
  BellOutlined,
  CloseOutlined,
  CheckOutlined,
} from '@ant-design/icons-vue'

const icons = [
  HomeOutlined,
  PartitionOutlined,
  SettingOutlined,
  TeamOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PoweroffOutlined,
  LockOutlined,
  UserOutlined,
  InsuranceOutlined,
  TransactionOutlined,
  AuditOutlined,
  FundViewOutlined,
  ApartmentOutlined,
  BellOutlined,
  CloseOutlined,
  CheckOutlined,
]
export default {
  // 全局注册引入的所有图标
  install: (app) => icons.forEach((item) => app.component(item.displayName, item))
}
