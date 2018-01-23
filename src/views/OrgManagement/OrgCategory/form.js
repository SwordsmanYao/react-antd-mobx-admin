import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Row, Col, Input, Modal } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create({
  onFieldsChange(props, changedFields) {
    const { orgCategory } = props;
    console.log('onFieldsChange', changedFields);
    orgCategory.setCurrentNodeField(changedFields);
  },
  mapPropsToFields(props) {
    console.log('mapPropsToFields', props.orgCategory.currentNode.Name);
    const { orgCategory }  = props;
    return {
      Name: Form.createFormField({
        ...orgCategory.currentNode.Name,
      }),
      SortCode: Form.createFormField({
        ...orgCategory.currentNode.SortCode,
      }),
      Description: Form.createFormField({
        ...orgCategory.currentNode.Description,
      }),
    };
  },
})
@observer
export default class MenuForm extends Component {
  
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // 表单提交
  handleSubmit = (e) => {
    const { form, orgCategory, setModalVisible } = this.props;

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('values', values);
        const data = {
          ...values,
        };
        if (orgCategory.currentNode.UniqueID && orgCategory.currentNode.UniqueID.value) {
          data.UniqueID = orgCategory.currentNode.UniqueID.value;
        }

        orgCategory.commit(data);
        setModalVisible(false);        
      }
    });
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
        visible={modalVisible}
        onOk={this.handleSubmit}
        onCancel={() => setModalVisible(false)}
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
                label="排序代码"
              >
                {getFieldDecorator('SortCode', {
                  rules: [{
                    required: true, message: '请输入数字格式排序代码', pattern: /^[0-9]*$/,
                  }],
                })(
                  <Input />,
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
          </Row>
        </Form>
      </Modal>
    );
  }
}