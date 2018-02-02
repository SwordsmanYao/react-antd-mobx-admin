import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Button, Table, Divider, Popconfirm, message } from 'antd';

import DisplayTree from '@/components/DisplayTree';
import MenuForm from './form';
import styles from './index.less';


const { Sider, Content } = Layout;

@inject('menu')
@observer
export default class Menu extends Component {
  constructor(props) {
    super(props);
    
    this.onSelect = this.onSelect.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.handleNew = this.handleNew.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  componentWillMount() {
    const { menu } = this.props;

    menu.fetchTree();
    menu.refreshList();
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log('pagination', pagination);
    console.log('filters', filters);
    console.log('sorter', sorter);
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
        CurrentPage: menu.pagination.current,
        PageSize: menu.pagination.pageSize,
      });
    }
  }

  // 设置模态框显示/隐藏
  setModalVisible(modalVisible) {
    const { menu } = this.props;
    menu.setData({
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
    }, {
      title: '路径',
      dataIndex: 'Path',
      key: 'Path',
    }, {
      title: '排序',
      dataIndex: 'SortCode',
      key: 'SortCode',
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
          <Popconfirm 
            placement="bottom" 
            title="如果有子节点会一同删除，确认要删除这条记录吗？" 
            onConfirm={() => { this.handleRemove(record); }} 
            okText="是" 
            cancelText="否"
          >
            <a
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >删除
            </a>
          </Popconfirm>

        </span>
      ),
    }];

    return (
      <Layout className={styles.layout}>
        <Sider width={220} style={{ background: '#fff' }}>
          {
            menu.treeList && menu.treeList.length > 0 &&
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
          }
        </Sider>
        <Content style={{ background: '#fff', marginLeft: 10, padding: 30 }}>
          <div className={styles.toolbar}>
            <Button
              icon="plus"
              onClick={this.handleNew}
              loading={menu.newBtnLoading}
            >新建</Button>
            <MenuForm
              menu={menu}
              modalVisible={menu.modalVisible}
              setModalVisible={setModalVisible}
            />
          </div>
          <Table
            size="small"
            loading={menu.loading}
            pagination={menu.pagination}
            dataSource={menu.list.slice()}
            columns={columns}
            rowKey="UniqueID"
            onChange={this.handleTableChange}
            locale={{
              filterTitle: '筛选',
              filterConfirm: '确定',
              filterReset: '重置',
              emptyText: '暂无数据',
            }}
          />
        </Content>
      </Layout>
    );
  }
}
