import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Table, Modal, message, Alert } from 'antd';

import DisplayTree from '@/components/DisplayTree';
import StepModal from '@/components/StepModal';
import MenuForm from './form';
import MenuButton from './MenuButton';
import MenuList from './MenuList';
import MenuToolBar from './toolBar';
import styles from './index.less';


const { Sider, Content } = Layout;
const { confirm } = Modal;

@inject('menu', 'menuButton', 'menuList')
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
        selectedRowKeys: [],
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
  handleEdit = () => {
    const { menu } = this.props;

    menu.fetchDetail().then(() => {
      menu.setCurrentForm(menu.currentDetail);
      this.setModalVisible(true);
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }

  // 清空选中条目
  cleanSelectedKeys = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { menu } = this.props;

    menu.setData({
      selectedRowKeys: [],
    });
  }

  // 批量删除选中条目
  handleRemoveChecked = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { menu } = this.props;

    
    confirm({
      title: `确认要删除这 ${menu.selectedRowKeys.length} 条记录吗?`,
      content: '',
      onOk: () => {
        this.handleRemove(menu.selectedRowKeys);
      },
    });
  }

  // 删除
  handleRemove = (Params) => {
    const { menu } = this.props;

    menu.remove({
      UniqueID: Params[0],
    }).then(() => {
      message.success('删除成功');
      // 在选中条目中清除已经删除的
      menu.setData({
        selectedRowKeys: menu.selectedRowKeys.filter(item => (Params.indexOf(item) === -1)),
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
    const { menu } = this.props;

    menu.setData({
      selectedRowKeys,
    });
  }

  render() {
    const { menu } = this.props;
    const { setModalVisible } = this;
    const columns = [{ 
      title: '序号',
      dataIndex: 'NO',
      width: '7%',
      className:'alignCenter', 
      render: (text, row, index) =>(index + 1),
    }, {
      title: '名称',
      dataIndex: 'Name',
      key: 'Name',
      width: '20%',
    }, {
      title: '路径',
      dataIndex: 'Path',
      key: 'Path',
      width: '30%',
    }, {
      title: '排序',
      dataIndex: 'SortCode',
      key: 'SortCode',
      width: '10%',
    }, {
      title: '类型',
      dataIndex: 'Category',
      key: 'Category',
      width: '15%',
      render: (text, row, index) => {
        switch(text)
        {
          case 1:
            return '目录';
          case 2:
            return '栏目';
          case 3:
            return '代码';
          default:
            return '-';
        }
      }
    }, {
      title: '显示',
      dataIndex: 'IsDisplayed',
      key: 'IsDisplayed',
      render: (text, row, index) => (text===1 ? '是' : '否')
    },];

    let steps = [{
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
        menu.clearCurrentForm();
      },
    }];

    // 类型为栏目的可以设置 系统按钮 和 系统视图
    if(menu.currentForm && menu.currentForm.Category && menu.currentForm.Category.value === 2) {
      steps = [
        ...steps,
        {
          title: '系统按钮',
          component: MenuButton,
          isWrappedComponent: false,
          afterClose: () => {
            const { menuButton } = this.props;
            menuButton.reset();
          },
        }, {
          title: '系统视图',
          component: MenuList,
          isWrappedComponent: false,
          afterClose: () => {
            const { menuList } = this.props;
            menuList.reset();
          },
        },
      ];
    }

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
        <Content style={{ paddingLeft: 24 }}>
          <MenuToolBar 
            menu={menu}
            handleNew={this.handleNew}
            handleEdit={this.handleEdit}
            handleRemoveChecked={this.handleRemoveChecked}
          />
          <StepModal
            modalVisible={this.state.modalVisible}
            setModalVisible={setModalVisible}
            title="菜单管理"
            steps={steps}
          />
          <div className={styles.tableAlert}>
            <Alert
              message={(
                <div>
                  已选择 <a style={{ fontWeight: 600 }}>{menu.selectedRowKeys.length}</a> 项
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }} disabled={menu.selectedRowKeys.length <= 0}>清空</a>
                </div>
              )}
              type="info"
              showIcon
            />
          </div>
          <Table
            bordered
            size="small"
            loading={menu.loading}
            pagination={false}
            dataSource={menu.list.slice()}
            columns={columns}
            rowKey="UniqueID"
            onChange={this.handleTableChange}
            rowSelection={{
              selectedRowKeys: menu.selectedRowKeys,
              onChange: this.onSelectionChange,
            }}
            scroll={{ y: window.innerHeight - 293 }}
          />
        </Content>
      </Layout>
    );
  }
}
