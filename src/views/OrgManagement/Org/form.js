import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Row, Col, Input, Select, Modal, message } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@Form.create({
  onFieldsChange(props, changedFields) {
    const { org } = props;
    console.log('onFieldsChange', changedFields);
    org.setCurrentNodeField(changedFields);
  },
  mapPropsToFields(props) {
    const { currentNode }  = props.org;
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
export default class OrgForm extends Component {
  
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.afterClose = this.afterClose.bind(this);
  }

  componentDidMount() {
    const { org } = this.props;
    org.fetchCategoryTextValue();
  }

  // 表单提交
  handleSubmit = (e) => {
    const { form, org, setModalVisible } = this.props;

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('values', values);
        const data = {
          ...values,
          ParentID: org.selectedKeys[0],
        };
        if (org.currentNode.UniqueID && org.currentNode.UniqueID.value) {
          data.UniqueID = org.currentNode.UniqueID.value;
        }

        org.commit(data).then(() => {
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
    const { org } = this.props;
    org.clearCurrentNode();
  }
  

  render() {

    const { getFieldDecorator } = this.props.form;

    const { modalVisible, setModalVisible, org } = this.props;

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
        title="机构管理"
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
                {getFieldDecorator('FullName', {
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
                label="机构类别"
              >
                {getFieldDecorator('CategoryID', {
                  rules: [{
                    required: true, message: '请选择机构类别',
                  }],
                })(
                  <Select>
                    {
                      org.categoryTextValue.map(item => (
                        <Option value={parseInt(item.value, 10)} key={item.value}>{item.text}</Option>
                      ))
                    }
                  </Select>,
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