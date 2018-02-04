import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Row, Col, Input, Radio, Select, Modal } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const { Option } = Select;

@Form.create({
  onFieldsChange(props, changedFields) {
    const { menu } = props;
    console.log('onFieldsChange', changedFields);
    menu.setCurrentNodeField(changedFields);
  },
  mapPropsToFields(props) {
    const { currentNode }  = props.menu;
    console.log('mapPropsToFields', currentNode);

    let fields = {};
    Object.keys(currentNode).forEach( key => {
      fields[key] = Form.createFormField({
        ...currentNode[key],
      });
    });

    return fields;
  },
  onValuesChange(_, values) {
    console.log(values);
  },
})
@observer
export default class MenuForm extends Component {

  // 表单提交
  handleSubmit = (e) => {
    const { form, menu, setModalVisible } = this.props;

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('values', values);
        const data = {
          ...values,
          ParentID: menu.selectedKeys[0],
        };
        if (menu.currentNode.UniqueID && menu.currentNode.UniqueID.value) {
          data.UniqueID = menu.currentNode.UniqueID.value;
        }

        menu.commit(data).then(() => {
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
    const { menu } = this.props;
    menu.clearCurrentNode();
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
        title="菜单"
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
                label="路径"
              >
                {getFieldDecorator('Path', {
                  rules: [{
                    required: true, message: '请输入路径',
                  }],
                })(
                  <Input />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="排序代码"
              >
                {getFieldDecorator('SortCode', {
                  rules: [{
                    message: '请输入数字格式排序代码', pattern: /^[0-9]*$/,
                  }],
                })(
                  <Input />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="图标"
              >
                {getFieldDecorator('IconName')(
                  <Input />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="类型"
              >
                {getFieldDecorator('Category', {
                  rules: [{
                    required: true, message: '请选择类型',
                  }],
                })(
                  <Select>
                    <Option value={1}>目录</Option>
                    <Option value={2}>栏目</Option>
                    <Option value={3}>代码</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="描述"
              >
                {getFieldDecorator('Description')(
                  <TextArea autosize />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="是否显示"
              >
                {getFieldDecorator('IsDisplayed', {
                  rules: [{
                    required: true, message: '请选择是否显示',
                  }],
                })(
                  <RadioGroup>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </RadioGroup>,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}