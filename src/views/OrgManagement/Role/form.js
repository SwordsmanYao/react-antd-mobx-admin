import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Row, Col, Input, Modal, message, Radio } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

@Form.create({
  onFieldsChange(props, changedFields) {
    const { role } = props;
    console.log('onFieldsChange', changedFields);

    role.setCurrentNodeField(changedFields);
  },
  mapPropsToFields(props) {
    const { currentNode }  = props.role;
    console.log('mapPropsToFields', currentNode);

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
export default class RoleForm extends Component {

  // 表单提交
  handleSubmit = (e) => {
    const { form, role, setModalVisible } = this.props;

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('values', values);
        const data = {
          ...values,
        };
        if (role.currentNode.UniqueID && role.currentNode.UniqueID.value) {
          data.UniqueID = role.currentNode.UniqueID.value;
        }

        role.commit(data).then(() => {
          message.success('提交成功');
          setModalVisible(false);
        }).catch(({ ModelState }) => {
          
          // 设置服务器返回的错误校验信息
          let fields = {};
          Object.keys(ModelState).forEach(key => {
            fields[key] = {
              value: values[key],
              errors: [new Error(ModelState[key])],
            }
          });

          form.setFields(fields);
        }); 
      }
    });
  }

  afterClose = () => {
    const { role } = this.props;
    role.clearCurrentNode();
  }
  

  render() {

    const { getFieldDecorator } = this.props.form;

    const { modalVisible, setModalVisible } = this.props;

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
        title="角色管理"
        okText="确定"
        cancelText="取消"
        width="750px"
        visible={modalVisible}
        onOk={this.handleSubmit}
        onCancel={() => setModalVisible(false)}
        afterClose={this.afterClose}
      >
        <Form>
          <Row gutter={24} >
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="名称"
              >
                {getFieldDecorator('Name', {
                  rules: [{
                    required: true, message: '请输入名称',
                  }],
                })(
                  <Input />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="状态"
              >
                {getFieldDecorator('IsAvailable', {
                  rules: [{
                    required: true, message: '请选择是否可用',
                  }],
                })(
                  <RadioGroup>
                    <Radio value={1}>启用</Radio>
                    <Radio value={0}>禁用</Radio>
                  </RadioGroup>,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="描述"
              >
                {getFieldDecorator('DescInfo')(
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