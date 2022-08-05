<template>
  <div class="yj-wrap">
    <a-form
      ref="formRef"
      name="advanced_search"
      class="ant-advanced-search-form"
      :model="formState"
      @finish="onFinish"
    >
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            :name="`field-1`"
            :label="`包含以下全部关键字`"
            :rules="[{ required: false, message: 'input something' }]"
          >
            <a-input v-model:value="formState[`field-1`]" placeholder="placeholder"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :name="`field-2`"
            :label="`包含以下任意一个关键字`"
            :rules="[{ required: false, message: 'input something' }]"
          >
            <a-input v-model:value="formState[`field-2`]" placeholder="placeholder"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            :name="`field-3`"
            label="QB发起人"
            :rules="[{ required: false, message: 'input something' }]"
          >
            <a-input v-model:value="formState[`field-3`]" placeholder="placeholder"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            :name="`field-4`"
            label="QB发时间"
            :rules="[{ required: false, message: 'input something' }]"
          >
            <a-date-picker v-model:value="formState[`field-4`]" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            :name="`field-5`"
            label="QB来源"
            :rules="[{ required: false, message: 'input something' }]"
          >
            <a-select
              v-model:value="formState[`field-5`]"
              placeholder="placeholder"
              allow-clear
              style="width: 100%"
            >
              <a-select-option value="jack">Jack</a-select-option>
              <a-select-option value="lucy">Lucy</a-select-option>
              <a-select-option value="Yiminghe">yiminghe</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            :name="`field-6`"
            label="估值"
            :rules="[{ required: false, message: 'input something' }]"
          >
            <a-select
              v-model:value="formState[`field-6`]"
              placeholder="placeholder"
              allow-clear
              style="width: 100%"
            >
              <a-select-option value="jack">Jack</a-select-option>
              <a-select-option value="lucy">Lucy</a-select-option>
              <a-select-option value="Yiminghe">yiminghe</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col style="text-align: right">
          <a-button type="primary" html-type="submit">查询</a-button>
          <a-button style="margin: 0 8px" @click="() => formRef?.resetFields()">重置</a-button>
        </a-col>
      </a-row>
    </a-form>

    <a-table
      sticky
      bordered
      :columns="columns"
      :row-key="(record: any) => record.login.uuid"
      :data-source="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex === 'name'"> {{ text.first }}---{{ text.last }} </template>
      </template>
    </a-table>
  </div>
</template>
<!-- keywords -->
<script lang="ts">
  import { defineComponent, reactive, ref, computed } from 'vue'
  import type { FormInstance } from 'ant-design-vue'
  import { usePagination } from 'vue-request'
  import axios from 'axios'
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '120',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      width: '120',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      width: '120',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      width: '120',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      width: '120',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
  ]

  type APIParams = {
    results: number
    page?: number
    sortField?: string
    sortOrder?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
  type APIResult = {
    results: {
      gender: 'female' | 'male'
      name: string
      email: string
    }[]
  }

  const queryData = (params: APIParams) => {
    return axios.get<APIResult>('https://randomuser.me/api?noinfo', { params })
  }

  export default defineComponent({
    components: {
      // DownOutlined,
      // UpOutlined
    },
    setup() {
      const expand = ref(false)
      const formRef = ref<FormInstance>()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formState = reactive<any>({})
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onFinish = (values: any) => {
        // console.log("formState: ", formState);
        // eslint-disable-next-line no-console
        console.log('Received values of form: ', values)
      }
      const {
        data: dataSource,
        run,
        loading,
        current,
        pageSize,
      } = usePagination(queryData, {
        formatResult: (res) => res.data.results,
        pagination: {
          currentKey: 'page',
          pageSizeKey: 'results',
        },
      })

      const pagination = computed(() => ({
        total: 200,
        current: current.value,
        pageSize: pageSize.value,
      }))
      function handleTableChange(
        pag: { pageSize: number; current: number },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filters: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sorter: any
      ) {
        run({
          results: pag.pageSize!,
          page: pag?.current,
          sortField: sorter.field,
          sortOrder: sorter.order,
          ...filters,
        })
      }
      return {
        formRef,
        formState,
        expand,
        onFinish,
        dataSource,
        pagination,
        loading,
        columns,
        handleTableChange,
      }
    },
  })
</script>
<style lang="less">
  .yj-wrap {
    background-color: #fff;
    padding: 20px;
  }
</style>
