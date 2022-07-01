
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
const fullProject = (newJson: any, project: any) => {
  let project_id = uuidv4();
  newJson['project'] = {
    project_id,
    team_id: '-1',
    name: project?.name || '新建项目',
    description: project?.description || '',
    variable: project.hasOwnProperty('variable') && typeof project.variable == 'object' ? project.variable : {},
    request: {
      description: project?.request?.description || '',
      auth: project.hasOwnProperty('auth') && typeof project.auth == 'object' ? project.auth : {
        type: 'noauth',
        kv: {
          key: '',
          value: '',
        },
        bearer: {
          key: ''
        },
        basic: {
          username: '',
          password: ''
        }
      },
      header: [],
      query: [],
      body: [],
      cookie: []
    },
    script: {
      pre_script: project?.script?.pre_script || '',
      pre_script_switch: 1,
      test: project?.script?.test || '',
      test_switch: 1,
    },
    globalDescription: {
      project_id,
      list: []
    },
    methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLINK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND', 'VIEW'],
    mark: [{
      key: 'developing',
      name: '开发中',
    },
    {
      key: 'complated',
      name: '已完成',
    },
    {
      key: 'modifying',
      name: '需修改',
    },
    ],
    is_admin: 1,
    is_manager: 1,
    createTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
  }
}
const fullEnv = (newJson: any, env: any) => {
  const { project_id } = newJson.project || {};
  newJson['env'] = [];
  if (env && env instanceof Array && env.length > 0) {
    env.forEach(item => {
      let env_id = uuidv4();
      newJson.env.push({
        name: item?.name || '未命名环境',
        pre_url: item?.pre_url || '',
        type: item?.type || 'custom',
        list: item?.list || {},
        env_id,
        id: `${project_id}/${env_id}`
      })
    })
  }
}
const createApi = (items: any[], newJson: any, pid: string = '0') => {
  const { project_id } = newJson.project || {}
  items.forEach(api => {
    const { request } = api || {};
    let target_type = 'api';
    if (api.hasOwnProperty('target_type')) {
      if (api.target_type == 'folder' || (api.hasOwnProperty('children') && api.children instanceof Array)) {
        target_type = 'folder';
      } else {
        target_type = 'api';
      }
    }
    let target: any = {
      update_day: parseInt(String(new Date(new Date().toLocaleDateString()).getTime() / 1000), 10),
      update_dtime: Date.parse(String(new Date())) / 1000,
      create_dtime: Date.parse(String(new Date())) / 1000,
      is_changed: -1,
      mark: api?.mark || 'developing',
      method: api.hasOwnProperty('method') ? api.method.toUpperCase() : 'POST',
      parent_id: pid || '0',
      project_id,
      sort: -1,
      target_id: uuidv4(),
      type_sort: '1',
      version: 1,
      target_type
    }
    if (target_type == 'folder') {
      target['name'] = api?.name || '新建目录';
      target['request'] = {
        auth: request && request.hasOwnProperty('auth') && typeof request.auth == 'object' ? request.auth : {
          type: 'noauth',
          kv: {
            key: '',
            value: '',
          },
          bearer: {
            key: ''
          },
          basic: {
            username: '',
            password: ''
          }
        },
        body: request && request.hasOwnProperty('body') && request.body instanceof Array ? request.body : [],
        description: api?.description || '',
        header: request && request.hasOwnProperty('header') && request.header instanceof Array ? request.header : [],
        query: request && request.hasOwnProperty('query') && request.query instanceof Array ? request.query : [],
      }
      target['script'] = {
        pre_script: '',
        pre_script_switch: 1,
        test: '',
        test_switch: 1,
      }
      newJson.apis.push(target);
      createApi(api?.children || [], newJson, target.target_id);
    } else if (target_type == 'api') {
      target['name'] = api?.name || '新建接口';
      target['request'] = {
        auth: request && request.hasOwnProperty('auth') && typeof request.auth == 'object' ? request.auth : {
          type: 'noauth',
          kv: {
            key: '',
            value: '',
          },
          bearer: {
            key: ''
          },
          basic: {
            username: '',
            password: ''
          }
        },
        body: request && request.hasOwnProperty('body') && typeof request.body == 'object' ? request.body : {
          mode: 'none',
          parameter: [],
          raw: '',
          raw_para: []
        },
        cookie: {
          parameter: []
        },
        description: api?.description || '',
        event: {
          pre_script: '',
          test: ''
        },
        header: {
          parameter: request && request.hasOwnProperty('header') && request.header instanceof Array ? request.header : []
        },
        query: {
          parameter: request && request.hasOwnProperty('query') && request.query instanceof Array ? request.query : []
        },
        resful: {
          parameter: request && request.hasOwnProperty('resful') && request.resful instanceof Array ? request.resful : []
        },
        url: api?.url || ''
      }
      target['response'] = {
        success: {
          parameter: [],
          raw: ''
        },
        error: {
          parameter: [],
          raw: ''
        }
      }
      target['mock'] = '{}';
      target['mock_url'] = '';
      target['url'] = api?.url || '';
      newJson.apis.push(target);
    }
  })
}
const fullAPis = (newJson: any, apis: any) => {
  if (apis && apis instanceof Array && apis.length > 0) {
    newJson['apis'] = [];
    createApi(apis, newJson, '0');
  }
}
export const Module2ApiPostFull = (json: any) => {
  const { project, env, apis } = json;
  let newJson = {};
  fullProject(newJson, project);
  fullEnv(newJson, env);
  fullAPis(newJson, apis);
  return newJson;
}


export default Module2ApiPostFull;
