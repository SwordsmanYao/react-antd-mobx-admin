import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Row, Col, Input, Modal, message } from 'antd';

import styles from './form.less';

const FormItem = Form.Item;

@Form.create()
@observer
export default class UserForm extends Component {
  
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.afterClose = this.afterClose.bind(this);
  }

  // 表单提交
  handleSubmit = (e) => {
    const { form, user, setPwdModalVisible } = this.props;

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('values', values);
        user.resetPwd({
          UniqueID: user.resetPwdUser.UniqueID,
          LoginName: user.resetPwdUser.LoginName,
          NewPassword: values.NewPassword,
        }).then((status) => {

          if(status) {
            message.success('重置成功');
            setPwdModalVisible(false);
          } else if(user.error) {

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
          }
        }); 
      }
    });
  }

  // 关闭时重置状态
  afterClose = () => {
    const { resetFields } = this.props.form;
    const { user } = this.props;

    resetFields();

    user.setData({
      resetPwdUser: null,
    });
  }
  

  render() {

    const { getFieldDecorator, getFieldValue } = this.props.form;

    const { pwdModalVisible, setPwdModalVisible } = this.props;

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
        title="重置密码"
        visible={pwdModalVisible}
        onOk={this.handleSubmit}
        onCancel={() => setPwdModalVisible(false)}
        afterClose={this.afterClose}
      >
        <Form className={styles.form}>
          <Row gutter={24} >
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="新密码"
              >
                {getFieldDecorator('NewPassword', {
                  rules: [{
                    required: true, message: '请输入新密码', max: 48,
                  }],
                })(
                  <Input type="password" />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="确认密码"
              >
                {getFieldDecorator('ConfirmPassword', {
                  rules: [
                    {
                      required: true, 
                      message: '请输入确认密码', max: 48,
                    }, {
                      validator: (rule, value, callback) => (value && value !== getFieldValue('NewPassword') ? callback(true) :callback()),
                      message: '两次输入不一致',
                    },
                  ],
                })(
                  <Input type="password" />,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}