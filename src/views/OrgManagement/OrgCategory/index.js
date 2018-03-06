import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Table, Modal, message, Alert } from 'antd';

import OrgCategoryForm from './form';
import OrgCategoryToolBar from './toolBar';
import styles from './index.less';


const { Content } = Layout;
const { confirm } = Modal;

@inject('orgCategory')
@observer
export default class OrgCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
    }
  }

  componentWillMount() {
    const { orgCategory } = this.props;
    orgCategory.reset();
    orgCategory.refreshList();
  }

  componentWillUnmount() {
    const { orgCategory } = this.props;
    orgCategory.reset();
  }


  // 设置模态框显示/隐藏
  setModalVisible = (modalVisible) => {
    this.setState({
      modalVisible,
    });
  }

  // 新建
  handleNew = () => {
    this.setModalVisible(true);
  }

  // 修改
  handleEdit = () => {
    const { orgCategory } = this.props;

    orgCategory.fetchDetail().then(() => {
      orgCategory.setCurrentForm(orgCategory.currentDetail);
      this.setModalVisible(true);
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }
  
  // 清空选中条目
  cleanSelectedKeys = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { orgCategory } = this.props;

    orgCategory.setData({
      selectedRowKeys: [],
    });
  }

  // 批量删除选中条目
  handleRemoveChecked = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { orgCategory } = this.props;

    
    confirm({
      title: `确认要删除这 ${orgCategory.selectedRowKeys.length} 条记录吗?`,
      content: '',
      onOk: () => {
        this.handleRemove(orgCategory.selectedRowKeys);
      },
    });
  }

  // 删除
  handleRemove = (Params) => {
    const { orgCategory } = this.props;

    orgCategory.remove({
      Params,
    }).then(() => {
      message.success('删除成功');
      // 在选中条目中清除已经删除的
      orgCategory.setData({
        selectedRowKeys: orgCategory.selectedRowKeys.filter(item => (Params.indexOf(item) === -1)),
      });
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log('pagination', pagination);
    console.log('filters', filters);
    console.log('sorter', sorter);
  }

  // 勾选
  onSelectionChange = (selectedRowKeys, selectedRows) => {
    const { orgCategory } = this.props;

    orgCategory.setData({
      selectedRowKeys,
    });
  }

  render() {
    const { orgCategory } = this.props;

    const columns = [{ 
      title: '序号',
      dataIndex: 'NO',
      width: '6%',
      className:'alignCenter', 
      render: (text, row, index) =>(index + 1),
    }, {
      title: '名称',
      dataIndex: 'Name',
      key: 'Name',
      width: '30%',
    }, {
      title: '排序',
      dataIndex: 'SortCode',
      key: 'SortCode',
      width: '30%',
    },  {
      title: '描述',
      dataIndex: 'DescInfo',
      key: 'DescInfo',
    }];

    return (
      <Layout className={styles.layout}>
        <Content>
          <OrgCategoryToolBar 
            orgCategory={orgCategory}
            handleNew={this.handleNew}
            handleEdit={this.handleEdit}
            handleRemoveChecked={this.handleRemoveChecked}
          />
          <OrgCategoryForm
            orgCategory={orgCategory}
            modalVisible={this.state.modalVisible}
            setModalVisible={this.setModalVisible}
          />
          <div className={styles.tableAlert}>
            <Alert
              message={(
                <div>
                  已选择 <a style={{ fontWeight: 600 }}>{orgCategory.selectedRowKeys.length}</a> 项
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }} disabled={orgCategory.selectedRowKeys.length <= 0}>清空</a>
                </div>
              )}
              type="info"
              showIcon
            />
          </div>
          <Table
            bordered
            size="small"
            loading={orgCategory.loading}
            pagination={false}
            dataSource={orgCategory.list.slice()}
            columns={columns}
            rowKey="UniqueID"
            onChange={this.handleTableChange}
            rowSelection={{
              selectedRowKeys: orgCategory.selectedRowKeys,
              onChange: this.onSelectionChange,
            }}
            scroll={{ y: window.innerHeight - 220 }}
          />
        </Content>
      </Layout>
    );
  }
}
