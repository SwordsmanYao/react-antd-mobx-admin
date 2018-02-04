import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Button, Icon, Input } from 'antd';

import styles from './toolBar.less';

const FormItem = Form.Item;

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
    const { user, handleNew } = this.props;
    return (
      <div className={styles.toolBar}>
        <Form onSubmit={this.handleSearch} layout="inline">
          <div className={styles.buttons}>
            <Button
              style={{ marginRight: 20 }}
              icon="plus"
              onClick={handleNew} 
              loading={user.newBtnLoading}
            >新建</Button>
          </div>
          <FormItem label="登录名">
            {getFieldDecorator('LoginName')(
              <Input placeholder="请输入登录名" />
            )}
          </FormItem>
          <FormItem label="姓名">
            {getFieldDecorator('FullName')(
              <Input placeholder="请输入姓名" />
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
            </span>
          }
          <div className={styles.buttons}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 12 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 12 }} onClick={this.toggleForm}>
              { expandForm ? <span>收起 <Icon type="up" /></span> : <span>展开 <Icon type="down" /></span> }
            </a>
          </div>
          
        </Form>
      </div>
    );
  }
}