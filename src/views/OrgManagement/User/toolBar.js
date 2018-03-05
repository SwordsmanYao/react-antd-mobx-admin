import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Button, Icon, Input, Menu, Dropdown, Modal } from 'antd';

import styles from './toolBar.less';

const FormItem = Form.Item;
const { confirm } = Modal;

@Form.create()
@observer
export default class UserToolBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      expandForm: false,
    }
  }


  handleSearch = (e) => {

    e.preventDefault();
    e.stopPropagation();

    const { form, user } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        // // 格式化查询参数
        // Object.keys(values).forEach(key => {
        //   if(values[key]) {
        //     if(key === 'LM_OperateStartTime' || key === 'LM_OperateEndTime') {
        //       values[key] = values[key].format('YYYY-MM-DD');
        //     }
        //   }
        // });

        // 修改 store 数据
        user.setData({
          searchFormValues: values,
          pagination: {
            ...user.pagination,
            current: 1, //刷新时重置页码
          },
        });

        // 排序数据
        let orderData = {};
        if(user.orderField) {
          orderData = {
            OrderField: user.orderField,
            IsDesc: user.isDesc,
          }
        }

        // 发起请求
        user.fetchList({
          OrganizationID: user.selectedKeys[0],
          CurrentPage: 1,
          PageSize: user.pagination.pageSize,
          ...orderData,
          ...values,
        });
      }
    });
  }

  // 重置
  handleFormReset = () => {
    const { form, user } = this.props;
    
    form.resetFields();

    user.setData({
      searchFormValues: {},
    });
  }

  // 展开、关闭
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }
  
  render() {
    const { getFieldDecorator } = this.props.form;
    const { expandForm } = this.state;
    const { user, handleNew, handleEdit, handleRemoveChecked, handleResetPwd, handleEnableUser, handleRoleEdit } = this.props;

    const menu = (
      <Menu>
        <Menu.Item>
          <a
            onClick={(e) => {
              handleResetPwd();
            }}
          >重置密码
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            onClick={(e) => {
              confirm({
                title: "确认要启用该用户吗？",
                content: '',
                onOk: () => {
                  handleEnableUser([1]);
                },
              });
            }}
          >启用
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            onClick={(e) => {
              confirm({
                title: "确认要禁用该用户吗？",
                content: '',
                onOk: () => {
                  handleEnableUser([0]);
                },
              });
            }}
          >禁用
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            onClick={(e) => {
              handleRoleEdit();
            }}
          >角色
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className={styles.toolBar}>
        <Form onSubmit={this.handleSearch} layout="inline">
          <FormItem label="登录名">
            {getFieldDecorator('LoginName')(
              <Input placeholder="请输入登录名" />
            )}
          </FormItem>
          {
            expandForm && 
            <span>
              <FormItem label="手机">
                {getFieldDecorator('MobilePhone')(
                  <Input placeholder="请输入手机号码" />
                )}
              </FormItem>
              <FormItem label="姓名">
                {getFieldDecorator('FullName')(
                  <Input placeholder="请输入姓名" />
                )}
              </FormItem>
            </span>
          }
          <div className={styles.buttons}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 12 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 12 }} onClick={this.toggleForm}>
              { expandForm ? <span>收起 <Icon type="up" /></span> : <span>展开 <Icon type="down" /></span> }
            </a>
          </div>
          <div className={styles.buttonGroups}>
            <Button.Group>
              <Button
                icon="plus"
                onClick={handleNew}
                loading={user.newBtnLoading}
              >
                新建
              </Button>
              <Button
                icon="edit"
                onClick={handleEdit}
              >
                编辑
              </Button>
              <Button
                icon="delete"
                onClick={handleRemoveChecked}
              >
                删除
              </Button>
              <Dropdown overlay={menu}>
                <Button>
                  更多<Icon type="down" />
                </Button>
              </Dropdown>
            </Button.Group>
          </div>
        </Form>
      </div>
    );
  }
}