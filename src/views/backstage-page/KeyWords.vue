<template>
  <div class="keywords-wrap page-wrap">
    <a-form
      ref="formRef"
      name="advanced_search"
      class="ant-advanced-search-form"
      :model="formState"
      @finish="onFinish">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            :name="`field-1`"
            :label="`包含以下全部关键字`"
            :rules="[{ required: false, message: 'input something' }]">
            <a-input v-model:value="formState[`field-1`]" placeholder="placeholder"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :name="`field-2`"
            :label="`包含以下任意一个关键字`"
            :rules="[{ required: false, message: 'input something' }]">
            <a-input v-model:value="formState[`field-2`]" placeholder="placeholder"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            :name="`field-3`"
            label="QB发起人"
            :rules="[{ required: false, message: 'input something' }]">
            <a-input v-model:value="formState[`field-3`]" placeholder="placeholder"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            :name="`field-4`"
            label="QB发时间"
            :rules="[{ required: false, message: 'input something' }]">
            <a-date-picker v-model:value="formState[`field-4`]" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            :name="`field-5`"
            label="QB来源"
            :rules="[{ required: false, message: 'input something' }]">
            <a-select
              v-model:value="formState[`field-5`]"
              placeholder="placeholder"
              allow-clear
              style="width: 100%">
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
            :rules="[{ required: false, message: 'input something' }]">
            <a-select
              v-model:value="formState[`field-6`]"
              placeholder="placeholder"
              allow-clear
              style="width: 100%">
              <a-select-option value="jack">Jack</a-select-option>
              <a-select-option value="lucy">Lucy</a-select-option>
              <a-select-option value="Yiminghe">yiminghe</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col style="text-align: right">
          <a-button type="primary" html-type="submit" @click="onSubmit">查询</a-button>
          <a-button style="margin: 0 8px" @click="() => formRef?.resetFields()">重置</a-button>
        </a-col>
      </a-row>
    </a-form>

    <a-table
      sticky
      bordered
      :columns="columns"
      :row-key="(record: any) => record.id"
      :data-source="dataSource?.list"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange">
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex === 'name'"> {{ text.first }}---{{ text.last }} </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { useRequest } from 'vue-request'
import axios from 'axios'

defineOptions({
  name: 'Keywords',
})

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: '120',
  },
  {
    title: 'dataSoruce',
    dataIndex: 'dataSoruce',
    width: '120',
  },
  {
    title: 'context',
    dataIndex: 'context',
    width: '120',
  },
  {
    title: 'title',
    dataIndex: 'title',
    width: '120',
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

const queryData = (params: APIParams) => {
  return axios.post<APIResult>('/api/v1/list', { params })
}
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
} = useRequest(
  async (params) => {
    const result = await queryData(params)
    return result.data?.data
  },
  {
    onSuccess(res) {
      console.log(res)
    },
  },
)
function onSubmit() {
  console.log('onsubmit')
}

const pagination = reactive({
  total: 200,
  current: 1,
  pageSize: 20,
})
function handleTableChange(
  pag: { pageSize: number; current: number },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sorter: any,
) {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  run({
    results: pag.pageSize!,
    page: pag?.current,
    sortField: sorter.field,
    sortOrder: sorter.order,
    ...filters,
  })
}
</script>
<style lang="less"></style>
