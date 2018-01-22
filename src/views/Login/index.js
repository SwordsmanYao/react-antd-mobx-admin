import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router-dom';
import { Form, Icon, Input, Checkbox, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import styles from './index.less';
import logo from '@/assets/logo.svg';

const FormItem = Form.Item;


@Form.create()
@inject('user')
@observer
export default class Login extends Component {
  
  handleSubmit = (e) => {
    const { form, user } = this.props;
    e.preventDefault();
    form.validateFields({ force: true },
      (err, values) => {
        if (!err) {
          console.log(values);
          user.login(values);
        }
      }
    );
  }

  render() {

    const { form, user } = this.props;

    const { getFieldDecorator } = form;

    return (
      <DocumentTitle title="登录">
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Ant Design</span>
              </Link>
            </div>
            <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
          </div>
          <div className={styles.main}>
            <Form onSubmit={this.handleSubmit}>
              {/* {
                user.status === 'error' &&
                user.submitting === false &&
                this.renderMessage('账户或密码错误')
              } */}
              <FormItem>
                {getFieldDecorator('LoginName', {
                  rules: [{
                    required: true, message: '请输入用户名',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="user" className={styles.prefixIcon} />}
                    placeholder="请输入用户名"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('LoginPwd', {
                  rules: [{
                    required: true, message: '请输入密码',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="lock" className={styles.prefixIcon} />}
                    type="password"
                    placeholder="请输入密码"
                  />
                )}
              </FormItem>
              <FormItem className={styles.additional}>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(
                  <Checkbox className={styles.autoLogin}>记住密码</Checkbox>
                )}
                <Button size="large" loading={user.submitting} className={styles.submit} type="primary" htmlType="submit">
                  登录
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}