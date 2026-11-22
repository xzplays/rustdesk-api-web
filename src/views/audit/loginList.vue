<template>
  <div>
    <el-card class="list-query" shadow="hover">
      <el-form inline label-width="80px">
        <el-form-item :label="T('Username')">
          <el-input v-model="listQuery.username" clearable></el-input>
        </el-form-item>
        <el-form-item :label="T('Guid')">
          <el-input v-model="listQuery.guid" clearable></el-input>
        </el-form-item>
        <el-form-item :label="T('Result')">
          <el-select v-model="listQuery.result" clearable :placeholder="T('All')" style="width: 120px">
            <el-option label="ok" value="ok"></el-option>
            <el-option label="fail" value="fail"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handlerQuery">{{ T('Filter') }}</el-button>
          <el-button type="success" @click="toExport">{{ T('Export') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="list-body" shadow="hover">
      <el-table :data="listRes.list" v-loading="listRes.loading" border>
        <el-table-column prop="id" label="ID" align="center" width="80"/>
        <el-table-column prop="created_at" :label="T('CreatedAt')" align="center" width="170"/>
        <el-table-column prop="guid" :label="T('Guid')" align="center" width="150" show-overflow-tooltip/>
        <el-table-column prop="uuid" label="uuid" align="center" width="120" show-overflow-tooltip/>
        <el-table-column prop="ip" :label="T('Ip')" align="center" width="140"/>
        <el-table-column prop="username" :label="T('Username')" align="center" width="120"/>
        <el-table-column :label="T('Result')" align="center" width="100">
          <template #default="{row}">
            <el-tag v-if="row.result === 'ok'" type="success">ok</el-tag>
            <el-tag v-else type="danger">{{ row.result }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" :label="T('Reason')" align="center" show-overflow-tooltip/>
      </el-table>
    </el-card>
    <el-card class="list-page" shadow="hover">
      <el-pagination background
                     layout="prev, pager, next, sizes, jumper"
                     :page-sizes="[10,20,50,100]"
                     v-model:page-size="listQuery.page_size"
                     v-model:current-page="listQuery.page"
                     :total="listRes.total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script setup>
  import { onActivated, onMounted, watch } from 'vue'
  import { useLoginRepositories } from '@/views/audit/reponsitories'
  import { T } from '@/utils/i18n'

  const {
    listRes,
    listQuery,
    getList,
    handlerQuery,
    toExport,
  } = useLoginRepositories()

  onMounted(getList)
  onActivated(getList)

  watch(() => listQuery.page, getList)
  watch(() => listQuery.page_size, handlerQuery)
</script>

<style scoped lang="scss">

</style>
