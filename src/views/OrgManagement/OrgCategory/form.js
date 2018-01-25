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
    const { currentNode }  = props.orgCategory;
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
export default class MenuForm extends Component {
  
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.afterClose = this.afterClose.bind(this);
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

        orgCategory.commit(data).then(() => {
          // 设置服务器返回的错误校验信息
          if(orgCategory.error) {

            const { ModelState } = orgCategory.error;

            let fields = {};
            Object.keys(ModelState).forEach(key => {
              fields[key] = {
                value: values[key],
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
    const { orgCategory } = this.props;
    orgCategory.clearCurrentNode();
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
        title="机构类别"
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