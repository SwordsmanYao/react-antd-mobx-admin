import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Button, Icon, Input, DatePicker } from 'antd';

import styles from './search.less';

const FormItem = Form.Item;

@Form.create()
@observer
export default class OperationLogSearch extends Component {

  constructor(props) {
    super(props);

    this.state = {
      expandForm: false,
    }

    this.handleSearch = this.handleSearch.bind(this);
    this.handleFormReset = this.handleFormReset.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
  }


  handleSearch = (e) => {

    e.preventDefault();
    e.stopPropagation();

    const { form, operationLog } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        // 格式化查询参数
        Object.keys(values).forEach(key => {
          if(values[key]) {
            if(key === 'LM_OperateStartTime' || key === 'LM_OperateEndTime') {
              values[key] = values[key].format('YYYY-MM-DD');
            }
          }
        });

        operationLog.setData({
          searchFormValues: values,
        });

        operationLog.fetchList({
          CurrentPage: 1,
          ...values,
        });
      }
    });
  }

  // 重置
  handleFormReset = () => {
    const { form, operationLog } = this.props;
    
    form.resetFields();

    operationLog.setData({
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

    return (
      <div className={styles.searchForm}>
        <Form onSubmit={this.handleSearch} layout="inline">
          <FormItem label="操作时间">
            {getFieldDecorator('LM_OperateStartTime')(
              <DatePicker placeholder="操作起始时间" />
            )}
          </FormItem>
          <FormItem colon={false}>
            {getFieldDecorator('LM_OperateEndTime')(
              <DatePicker placeholder="操作结束时间" />
            )}
          </FormItem>
          {
            expandForm && 
            <span>
              <FormItem label="操作者">
                {getFieldDecorator('LM_OperateUser')(
                  <Input placeholder="请输入操作者" />
                )}
              </FormItem>
              <FormItem label="操作类型">
                {getFieldDecorator('LM_OperateType')(
                  <Input placeholder="" />
                )}
              </FormItem>
            </span>
          }
          <div className={styles.buttons}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              { expandForm ? <span>收起 <Icon type="up" /></span> : <span>展开 <Icon type="down" /></span> }
            </a>
          </div>
          
        </Form>
      </div>
    );
  }
}