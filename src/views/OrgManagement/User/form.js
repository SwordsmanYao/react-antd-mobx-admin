import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Row, Col, Input, Modal, Radio, DatePicker } from 'antd';

import styles from './form.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

@Form.create({
  onFieldsChange(props, changedFields) {
    const { user } = props;
    user.setCurrentNodeField(changedFields);
  },
  mapPropsToFields(props) {
    const { currentNode }  = props.user;

    let fields = {};
    Object.keys(currentNode).forEach( key => {
      fields[key] = Form.createFormField({
        ...currentNode[key],
      });
    });

    return fields;
  },
})
@observer
export default class UserForm extends Component {
  
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.afterClose = this.afterClose.bind(this);
  }

  // 表单提交
  handleSubmit = (e) => {
    const { form, user, setModalVisible } = this.props;

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('values', values);

        Object.keys(values).forEach(key => {
          if(values[key]) {
            if(key === 'DateOfBirth' || key === 'DateOfBirth') {
              values[key] = values[key].format('YYYY-MM-DD');
            }
          }
        });

        const data = {
          LoginName: values.LoginName,
          Employee: {
            OrganizationID: user.selectedKeys[0],
            ...values,
          },
        };
        if (user.currentNode.UniqueID && user.currentNode.UniqueID.value) {
          data.UniqueID = user.currentNode.UniqueID.value;
          data.Employee.UniqueID = user.currentNode.EmployeeID.value;
        }
        if (values.LoginPwd) {
          data.LoginPwd = values.LoginPwd;
        }

        user.commit(data).then(() => {
          if(user.error) {
            // 设置服务器返回的错误校验信息
            const { ModelState } = user.error;

            let fields = {};
            Object.keys(ModelState).forEach(key => {
              const key2 = key.split('.').pop();
              fields[key2] = {
                value: values[key2],
                errors: [new Error(ModelState[key])],
              }
            });

            form.setFields(fields);
          } else {
            setModalVisible(false);
          }
        }); 
      }
    });
  }

  afterClose = () => {
    const { user } = this.props;
    user.clearCurrentNode();
  }
  

  render() {

    const { getFieldDecorator } = this.props.form;

    const { modalVisible, setModalVisible, user } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
      },
    };

    return (
      <Modal
        title="用户管理"
        okText="确定"
        cancelText="取消"
        width="750px"
        visible={modalVisible}
        onOk={this.handleSubmit}
        onCancel={() => setModalVisible(false)}
        afterClose={this.afterClose}
      >
        <Form className={styles.form}>
          <Row gutter={24} >
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="登录名"
              >
                {getFieldDecorator('LoginName', {
                  rules: [{
                    required: true, message: '请输入登录名',
                  }],
                })(
                  <Input />,
                )}
              </FormItem>
            </Col>
           {
              !user.currentNode.UniqueID && 
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="密码"
                >
                  {getFieldDecorator('LoginPwd', {
                    rules: [{
                      required: true, message: '请输入密码', max: 48,
                    }],
                  })(
                    <Input type="password" />,
                  )}
                </FormItem>
              </Col>
            }
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="姓名"
              >
                {getFieldDecorator('FullName', {
                  rules: [{
                    required: true, message: '请输入姓名',
                  }],
                })(
                  <Input />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="手机"
              >
                {getFieldDecorator('MobilePhone', {
                  rules: [{
                    required: true, message: '请输入手机号码',
                  }, {
                    pattern: /^[0-9]*$/, message: '请输入正确格式的手机号码',
                  }],
                })(
                  <Input />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="工号"
              >
                {getFieldDecorator('JobNumber')(
                  <Input />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="邮箱"
              >
                {getFieldDecorator('Email')(
                  <Input />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="性别"
              >
                {getFieldDecorator('Gender')(
                  <RadioGroup>
                    <Radio value={'男'}>男</Radio>
                    <Radio value={'女'}>女</Radio>
                  </RadioGroup>,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem 
                {...formItemLayout}
                label="生日"
              >
                {getFieldDecorator('DateOfBirth')(
                  <DatePicker />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="备注"
              >
                {getFieldDecorator('Remarks')(
                  <TextArea autosize />,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}