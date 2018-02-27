import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Row, Col, Input, Modal } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create({
  onFieldsChange(props, changedFields) {
    const { administrativeArea } = props;
    console.log('onFieldsChange', changedFields);
    administrativeArea.setCurrentNodeField(changedFields);
  },
  mapPropsToFields(props) {
    const { currentNode }  = props.administrativeArea;
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
export default class AdministrativeAreaForm extends Component {

  // 表单提交
  handleSubmit = (e) => {
    const { form, administrativeArea, setModalVisible } = this.props;

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('values', values);
        const data = {
          ...values,
          ParentID: administrativeArea.selectedKeys[0],
          JiBie: administrativeArea.selectedInfo.depthlevel + 1, // 深度等于父节点深度 + 1
        };

        if (administrativeArea.currentNode.OldUniqueID && administrativeArea.currentNode.OldUniqueID.value) {
          data.OldUniqueID = administrativeArea.currentNode.OldUniqueID.value;
        }

        administrativeArea.commit(data).then(() => {
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
    const { administrativeArea } = this.props;
    administrativeArea.clearCurrentNode();
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
        title="区域"
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
                label="编号"
              >
                {getFieldDecorator('UniqueID', {
                  rules: [
                    {
                      required: true, message: '请输入编号',
                    },
                    {
                      message: '请输入数字格式编号', pattern: /^[0-9]*$/,
                    },
                  ],
                })(
                  <Input />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="名称"
              >
                {getFieldDecorator('MingCheng', {
                  rules: [
                    {
                      required: true, message: '请输入名称',
                    },
                    {
                      message: '长度过长', max: 50,
                    },
                  ],
                })(
                  <Input />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="全拼"
              >
                {getFieldDecorator('QuanPin', {
                  rules: [
                    {
                      required: true, message: '请输入全拼',
                    },
                    {
                      message: '长度过长', max: 200,
                    },
                  ],
                })(
                  <Input />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="简拼"
              >
                {getFieldDecorator('JianPin', {
                  rules: [
                    {
                      required: true, message: '请输入简拼',
                    },
                    {
                      message: '长度过长', max: 200,
                    },
                  ],
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
                {getFieldDecorator('MiaoShu', {
                  rules: [{
                    message: '长度过长', max: 256,
                  }],
                })(
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