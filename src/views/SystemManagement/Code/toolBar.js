import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Button, Input } from 'antd';

import styles from './toolBar.less';

const FormItem = Form.Item;

@Form.create()
@observer
export default class CodeToolBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      expandForm: false,
    }
  }

  handleSearch = (e) => {

    e.preventDefault();
    e.stopPropagation();

    const { form, code } = this.props;

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
        code.setData({
          searchFormValues: values,
          pagination: {
            ...code.pagination,
            current: 1, //刷新时重置页码
          },
        });

        // 排序数据
        let orderData = {};
        if(code.orderField) {
          orderData = {
            OrderField: code.orderField,
            IsDesc: code.isDesc,
          }
        }

        // 发起请求
        code.fetchList({
          OrganizationID: code.selectedKeys[0],
          CurrentPage: 1,
          PageSize: code.pagination.pageSize,
          ...orderData,
          ...values,
        });
      }
    });
  }

  // 重置
  handleFormReset = () => {
    const { form, code } = this.props;
    
    form.resetFields();

    code.setData({
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
    const { code, handleNew } = this.props;
    return (
      <div className={styles.toolBar}>
        <Form onSubmit={this.handleSearch} layout="inline">
          <div className={styles.buttons}>
            <Button
              style={{ marginRight: 20 }}
              icon="plus"
              onClick={handleNew} 
              loading={code.newBtnLoading}
            >新建</Button>
          </div>
          <FormItem label="名称">
            {getFieldDecorator('Name')(
              <Input placeholder="请输入名称" />
            )}
          </FormItem>
          {/* {
            expandForm && 
            <span>
              <FormItem label="手机">
                {getFieldDecorator('MobilePhone')(
                  <Input placeholder="请输入手机号码" />
                )}
              </FormItem>
            </span>
          } */}
          <div className={styles.buttons}>
            <Button type="primary" htmlType="submit">查询</Button>
            {/* <Button style={{ marginLeft: 12 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 12 }} onClick={this.toggleForm}>
              { expandForm ? <span>收起 <Icon type="up" /></span> : <span>展开 <Icon type="down" /></span> }
            </a> */}
          </div>
          
        </Form>
      </div>
    );
  }
}