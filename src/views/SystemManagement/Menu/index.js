import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Button, Table, Divider, Modal, message } from 'antd';

import DisplayTree from '@/components/DisplayTree';
import StepModal from '@/components/StepModal';
import MenuForm from './form';
import MenuButton from './MenuButton';
import styles from './index.less';


const { Sider, Content } = Layout;
const { confirm } = Modal;

@inject('menu')
@observer
export default class Menu extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      modalVisible: false,
    }
  }

  componentWillMount() {
    const { menu } = this.props;
    menu.reset();
    menu.fetchTree();
    menu.refreshList();
  }

  componentWillUnmount() {
    const { menu } = this.props;
    menu.reset();
  }

  // 点击树节点时触发
  onSelect = (selectedKeys) => {
    console.log('selected', selectedKeys);
    const { menu } = this.props;

    if(selectedKeys.length > 0) {
      menu.setData({
        selectedKeys: selectedKeys,
      });
      
      menu.fetchList({
        ParentID: selectedKeys[0],
        // CurrentPage: menu.pagination.current,
        // PageSize: menu.pagination.pageSize,
      });
    }
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
  handleEdit = (record) => {
    const { menu } = this.props;
    console.log('record' ,record);

    menu.fetchDetail({
      UniqueID: record.UniqueID,
    }).then(() => {
      this.setModalVisible(true);
    });

    
  }
  // 删除
  handleRemove = (record) => {
    const { menu } = this.props;

    menu.remove({
      UniqueID: record.UniqueID,
    }).then(() => {
      message.success('删除成功');
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log('pagination', pagination);
    console.log('filters', filters);
    console.log('sorter', sorter);
  }

  render() {
    const { menu } = this.props;
    const { setModalVisible } = this;
    const columns = [{
      title: '名称',
      dataIndex: 'Name',
      key: 'Name',
      width: 120,
    }, {
      title: '路径',
      dataIndex: 'Path',
      key: 'Path',
      width: 120,
    }, {
      title: '排序',
      dataIndex: 'SortCode',
      key: 'SortCode',
      width: 120,
    }, {
      title: '操作',
      key: 'Action',
      width: 120,
      render: (text, record) => (
        <span>
          <a
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this.handleEdit(record);
            }}
          >编辑
          </a>
          <Divider type="vertical" />
            <a
              onClick={(e) => {
                confirm({
                  title: "如果有子节点会一同删除，确认要删除这条记录吗？",
                  content: '',
                  onOk: () => {
                    this.handleRemove(record);
                  },
                });
              }}
            >删除
            </a>
        </span>
      ),
    }];

    const steps = [{
      title: '系统功能',
      component: MenuForm,
      // 组件被Form.create()等包裹
      isWrappedComponent: true, 
      props: {
        menu,
      },
      // Modal 窗口关闭时触发
      afterClose: () => {
        const { menu } = this.props;
        menu.clearCurrentNode();
      },
    }, {
      title: '系统按钮',
      component: MenuButton,
      isWrappedComponent: false,
      props: {
        menu,
      },
      afterClose: () => {
      },
    }, {
      title: '系统视图',
      component: MenuForm,
      isWrappedComponent: false,
      props: {
        menu,
      },
      afterClose: () => {
      },
    }];

    return (
      <Layout className={styles.layout}>
        <Sider width={220}  style={{ height: window.innerHeight - 110, overflowY: 'scroll', overflowX: 'auto', background: '#fff' }}>
          <DisplayTree
            treeList={[{
              id: '0',
              name: '菜单管理',
              children: menu.treeList.slice(),
            }]}
            defaultExpandedKeys={['0']}
            onSelect={this.onSelect}
            selectedKeys={menu.selectedKeys.slice()}
          />
        </Sider>
        <Content style={{ paddingLeft: 30, paddingRight: 30 }}>
          <div className={styles.toolbar}>
            <Button
              icon="plus"
              onClick={this.handleNew}
              loading={menu.newBtnLoading}
            >新建</Button>
          </div>
          <StepModal
            modalVisible={this.state.modalVisible}
            setModalVisible={setModalVisible}
            title="菜单管理"
            steps={steps}
          />
          <Table
            bordered
            size="small"
            loading={menu.loading}
            pagination={false}
            dataSource={menu.list.slice()}
            columns={columns}
            rowKey="UniqueID"
            onChange={this.handleTableChange}
            scroll={{ y: window.innerHeight - 220 }}
          />
        </Content>
      </Layout>
    );
  }
}
