import React, { Component } from 'react';
import { Modal, Button, Steps, message } from 'antd';
import { observer } from 'mobx-react';

import styles from './index.less';

const Step = Steps.Step;

/**
 * 组件使用：
 * 属性：
 *  modalVisible 是否显示
 *  setModalVisible 设置是否显示 
 *  title 分步的标题
 *  steps 数据，eg：
 * const steps = [{
 *     title: '系统功能',
 *     component: MenuForm,
 *     // 组件被Form.create()等包裹
 *     isWrappedComponent: true, 
 *     props: {
 *       menu,
 *     },
 *     // Modal 窗口关闭时触发
 *     afterClose: () => {
 *        const { menu } = this.props;
 *       menu.clearCurrentNode();
 *     },
 *   }, {
 *     title: '系统按钮',
 *     component: MenuForm,
 *     isWrappedComponent: false,
 *     props: {
 *       menu,
 *     },
 *     afterClose: () => {
 *     },
 *   }];
 * 
 * 组件内需要声明函数：handleNextStep 进入先一步前执行
 * 组件内需要调用函数：goNext 进入下一步
 */
@observer
class StepModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      btnLoading: false,
      current: 0,
    }
  }

  handleComplete = () => {
    const { setModalVisible } = this.props;
    setModalVisible(false);
    message.success('操作完成');
  }

  handleNext = () => {
    // 通过 ref 调用子组件的方法
    if(this.childNode.handleNextStep) {
      this.childNode.handleNextStep();
    } else {
      this.goNext();
    }
  }
  handleBack = () => {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  goNext = () => {
    const current = this.state.current + 1;
    this.setState({ current });
    console.log('goNext');
  }
  setChildRef = (node) => {
    this.childNode = node;
  }
  afterClose = () => {
    const { steps } = this.props;
    steps.forEach(item => {
      item.afterClose();
    });
    this.setState({
      current: 0,
    });
  }

  render() {
    const { modalVisible, setModalVisible, title, steps } = this.props;
    const { btnLoading, current } = this.state;
    const { component: ChildComponent, isWrappedComponent } = steps[current];
    // 组件被Form.create()等包裹时使用 wrappedComponentRef 属性，否则使用 ref
    const ref = isWrappedComponent ? {wrappedComponentRef:this.setChildRef} : {ref:this.setChildRef};

    return (
      <Modal
        title={title}
        width="750px"
        style={{ top: 40 }}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        afterClose={this.afterClose}
        footer={[
          current > 0 &&
          <Button key="back" onClick={this.handleBack}>
            上一步
          </Button>,
          current < steps.length - 1 ?
          <Button key="next" type="primary" loading={btnLoading} onClick={this.handleNext}>下一步</Button>:
          <Button key="submit" type="primary" loading={btnLoading} onClick={this.handleComplete}>完成</Button>
        ]}
      >
        <Steps current={current}>
          {
            steps.map((item, index) => (
              <Step
                key={item.title}
                title={item.title}
                onClick={() => {
                  if(current > index) {
                    this.setState({current: index});
                  }
                }}
              />
            ))
          }
        </Steps>
        <div className={styles.stepContent}>
          <ChildComponent
            {
              ...ref
            } 
            {
              ...steps[current].props
            }
            goNext={this.goNext}
          />
        </div>
        

      </Modal>
    );
  }
}

export default StepModal;