<template>
  <div class="w-400px bg-#fff p-12px">
    <div class="flex mb-12px">
      <div class="w-80px flex-shrink-0">已选条件：</div>
      <Flex class="flex-1 flex-shrink-0" wrap="wrap" gap="small">
        <Tag
          v-if="formState.riskLevel"
          color="green"
          closable
          @close="formState.riskLevel = undefined"
        >
          风险等级 ：{{ formState.riskLevel }}
        </Tag>
        <Tag v-if="formState.phone" color="pink" closable @close="formState.phone = ''">
          手机号 ：{{ formState.phone }}
        </Tag>
        <Tag v-if="formState.idCard" color="blue" closable @close="formState.idCard = ''">
          身份证号 ：{{ formState.idCard }}
        </Tag>
      </Flex>
    </div>
    <div class="flex mb-12px w-100%">
      <div class="mr-12px">
        <Input v-model:value="formState.phone" :maxlength="11" placeholder="请输入手机号" />
      </div>
      <div>
        <Input v-model:value="formState.idCard" :maxlength="20" placeholder="请输入身份证号" />
      </div>
    </div>
    <div class="mb-12px">
      <Flex justify="space-around">
        <a class="ant-dropdown-link lh-1.5em flex-1 text-center" @click.prevent>
          户籍地
          <DownOutlined />
        </a>
        <Divider type="vertical" />
        <a class="ant-dropdown-link lh-1.5em flex-1 text-center" @click.prevent>
          派出所
          <DownOutlined />
        </a>
        <Divider type="vertical" />
        <Dropdown :trigger="['click']">
          <a class="ant-dropdown-link lh-1.5em flex-1 text-center" @click.prevent>
            {{ formState.riskLevel || '风险等级' }}
            <DownOutlined />
          </a>
          <template #overlay>
            <Menu>
              <MenuItem @click="onRiskLevelChange('高')">
                <a href="javascript:;">高</a>
              </MenuItem>
              <MenuItem @click="onRiskLevelChange('中')">
                <a href="javascript:;">中</a>
              </MenuItem>
              <MenuItem @click="onRiskLevelChange('低')">
                <a href="javascript:;">低</a>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </Flex>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import {} from '@vueuse/core';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { Flex, Tag, Input, Divider, Dropdown, Menu, MenuItem } from 'ant-design-vue';

  type RiskLevel = '高' | '中' | '低' | undefined;

  interface FormState {
    riskLevel: RiskLevel;
    phone: string;
    idCard: string;
  }

  const formState = reactive<FormState>({
    riskLevel: undefined,
    phone: '',
    idCard: '',
  });

  function onRiskLevelChange(value: RiskLevel) {
    formState.riskLevel = value;
  }
</script>

<style lang="less" scoped></style>
