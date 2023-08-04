
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
const fullProject = (newJson: any, project: any) => {
  let project_id = uuidv4();

  let markList = [];
  if (project?.markList instanceof Array && project.markList.length > 0) {
    for (const mark of project.markList) {
      markList.push({ old_key: mark?.key, key: uuidv4(), name: mark?.name || mark?.key || '自定义状态', color: '#f47373' })
    }
  }

  newJson['project'] = {
    project_id,
    team_id: '-1',
    name: project?.name || '新建项目',
    description: project?.description || '',
    details: {
      script: {
        pre_script: project?.script?.pre_script || '',
        pre_script_switch: 1,
        test: project?.script?.test || '',
        test_switch: 1,
      },
      markList: [{ key: 'developing', name: '开发中', color: '#3A86FF', is_default: true },
      { key: 'complated', name: '已完成', color: '#2BA58F', is_default: true },
      { key: 'modifying', name: '需修改', color: '#EC4646', is_default: true },
      ...markList,
      ],
      globalDescriptionVars: {
        project_id,
        list: []
      },
      request: {
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
          },
          digest: {
            username: '',
            password: '',
            realm: '',
            nonce: '',
            algorithm: '',
            qop: '',
            nc: '',
            cnonce: '',
            opaque: '',
          },
          hawk: {
            authId: '',
            authKey: '',
            algorithm: '',
            user: '',
            nonce: '',
            extraData: '',
            app: '',
            delegation: '',
            timestamp: '',
            includePayloadHash: -1,
          },
          awsv4: {
            accessKey: '',
            secretKey: '',
            region: '',
            service: '',
            sessionToken: '',
            addAuthDataToQuery: -1,
          },
          ntlm: {
            username: '',
            password: '',
            domain: '',
            workstation: '',
            disableRetryRequest: 1,
          },
          edgegrid: {
            accessToken: '',
            clientToken: '',
            clientSecret: '',
            nonce: '',
            timestamp: '',
            baseURi: '',
            headersToSign: '',
          },
          oauth1: {
            consumerKey: '',
            consumerSecret: '',
            signatureMethod: '',
            addEmptyParamsToSign: -1,
            includeBodyHash: -1,
            addParamsToHeader: -1,
            realm: '',
            version: '1.0',
            nonce: '',
            timestamp: '',
            verifier: '',
            callback: '',
            tokenSecret: '',
            token: '',
          },
        },
        header: project.hasOwnProperty('header') && project.header instanceof Array ? project.header : [],
        query: project.hasOwnProperty('query') && project.query instanceof Array ? project.query : [],
        body: project.hasOwnProperty('body') && project.body instanceof Array ? project.body : [],
        cookie: []
      },
      globalVars: project.hasOwnProperty('globalVars') && typeof project.globalVars == 'object' ? project.globalVars : {},
    },
    methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLINK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND', 'VIEW'],
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
  const { project_id , details } = newJson.project || {}
  items.forEach(api => {
    const { request } = api || {};
    let target_type = api?.target_type || 'api';
    let newMark = api?.mark;
    if(details?.markList instanceof Array){
      let old_mark = details.markList.find((item:any)=>item?.old_key === api?.mark);
      if(old_mark != undefined && Object.prototype.toString.call(old_mark) === '[object Object]'){
        newMark= old_mark?.key || api?.mark || 'developing'
      }
    }
   
    let target: any = {
      update_day: parseInt(String(new Date(new Date().toLocaleDateString()).getTime() / 1000), 10),
      update_dtime: Date.parse(String(new Date())) / 1000,
      create_dtime: Date.parse(String(new Date())) / 1000,
      is_changed: -1,
      mark: newMark,
      method: api.hasOwnProperty('method') ? api.method.toUpperCase() : 'POST',
      parent_id: pid || '0',
      project_id,
      sort: api?.sort || -1,
      target_id: uuidv4(),
      type_sort: '1',
      version: 1,
      target_type
    }
    if(target_type === 'sample'){
      target['example_type'] = 'api';
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
          },
          digest: {
            username: '',
            password: '',
            realm: '',
            nonce: '',
            algorithm: '',
            qop: '',
            nc: '',
            cnonce: '',
            opaque: '',
          },
          hawk: {
            authId: '',
            authKey: '',
            algorithm: '',
            user: '',
            nonce: '',
            extraData: '',
            app: '',
            delegation: '',
            timestamp: '',
            includePayloadHash: -1,
          },
          awsv4: {
            accessKey: '',
            secretKey: '',
            region: '',
            service: '',
            sessionToken: '',
            addAuthDataToQuery: -1,
          },
          ntlm: {
            username: '',
            password: '',
            domain: '',
            workstation: '',
            disableRetryRequest: 1,
          },
          edgegrid: {
            accessToken: '',
            clientToken: '',
            clientSecret: '',
            nonce: '',
            timestamp: '',
            baseURi: '',
            headersToSign: '',
          },
          oauth1: {
            consumerKey: '',
            consumerSecret: '',
            signatureMethod: '',
            addEmptyParamsToSign: -1,
            includeBodyHash: -1,
            addParamsToHeader: -1,
            realm: '',
            version: '1.0',
            nonce: '',
            timestamp: '',
            verifier: '',
            callback: '',
            tokenSecret: '',
            token: '',
          },
        },
        body: request && request.hasOwnProperty('body') && request.body instanceof Array ? request.body : [],
        description: api?.description || '',
        header: request && request.hasOwnProperty('header') && request.header instanceof Array ? request.header : [],
        query: request && request.hasOwnProperty('query') && request.query instanceof Array ? request.query : [],
      }
      target['script'] = {
        pre_script: request?.script?.pre_script || '',
        pre_script_switch: 1,
        test: request?.script?.test || '',
        test_switch: 1,
      }
      newJson.apis.push(target);
      createApi(api?.children || [], newJson, target.target_id);
    } else if (target_type == 'api' || target_type == 'sample') {
      target['name'] = api?.name || '新建接口';
      target.tags = api?.tags || [];
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
          },
          digest: {
            username: '',
            password: '',
            realm: '',
            nonce: '',
            algorithm: '',
            qop: '',
            nc: '',
            cnonce: '',
            opaque: '',
          },
          hawk: {
            authId: '',
            authKey: '',
            algorithm: '',
            user: '',
            nonce: '',
            extraData: '',
            app: '',
            delegation: '',
            timestamp: '',
            includePayloadHash: -1,
          },
          awsv4: {
            accessKey: '',
            secretKey: '',
            region: '',
            service: '',
            sessionToken: '',
            addAuthDataToQuery: -1,
          },
          ntlm: {
            username: '',
            password: '',
            domain: '',
            workstation: '',
            disableRetryRequest: 1,
          },
          edgegrid: {
            accessToken: '',
            clientToken: '',
            clientSecret: '',
            nonce: '',
            timestamp: '',
            baseURi: '',
            headersToSign: '',
          },
          oauth1: {
            consumerKey: '',
            consumerSecret: '',
            signatureMethod: '',
            addEmptyParamsToSign: -1,
            includeBodyHash: -1,
            addParamsToHeader: -1,
            realm: '',
            version: '1.0',
            nonce: '',
            timestamp: '',
            verifier: '',
            callback: '',
            tokenSecret: '',
            token: '',
          },
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
        description: api?.request?.description || '',
        event: {
          pre_script: request?.event?.pre_script || '',
          test: request?.event?.test || ''
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
          raw: api?.response?.success?.raw || ''
        },
        error: {
          parameter: [],
          raw: api?.response?.error?.raw || ''
        },
        ...(api?.response || {})
      }
      target['mock'] = '{}';
      target['mock_url'] = '';
      target['url'] = api?.url || '';
      newJson.apis.push(target);
      if(target_type == 'api'){
        createApi(api?.children || [], newJson, target.target_id);
      }
    }
  })
}
const fullAPis = (newJson: any, apis: any) => {
  if (apis && apis instanceof Array && apis.length > 0) {
    newJson['apis'] = [];
    createApi(apis, newJson, '0');
  }
}
const createModel = (items: any[], newJson: any, pid: string = '0') => {
  const { project_id } = newJson.project || {};
  items.forEach(model => {
    let model_type = 'model';
    if (model.hasOwnProperty('model_type')) {
      if (model.model_type == 'folder' || (model.hasOwnProperty('children') && model.children instanceof Array)) {
        model_type = 'folder';
      } else {
        model_type = 'model';
      }
    }
    let target: any = {
      update_day: parseInt(String(new Date(new Date().toLocaleDateString()).getTime() / 1000), 10),
      updated_time: Date.parse(String(new Date())) / 1000,
      created_time: Date.parse(String(new Date())) / 1000,
      is_changed: -1,
      parent_id: pid || '0',
      project_id,
      sort: model?.sort || -1,
      model_id: uuidv4(),
      model_type: model_type,
      old_model_id: model?.model_id || "",
      description: model?.description || '',
      version: 1,
    }
    if (model_type == 'folder') {
      target['name'] = model?.name || '新建目录';
      newJson.dataModel.push(target);
      createModel(model?.children || [], newJson, target.model_id);
    } else if (model_type == 'model') {
      target['name'] = model?.name || '新建接口';
      target['display_name'] = model?.displayName || '';
      target['schema'] = model?.schema || {};
      newJson.dataModel.push(target);
    }
  })
}
const fullDataModel = (newJson: any, dataModel: any) => {
  if (dataModel && dataModel instanceof Array && dataModel.length > 0) {
    newJson['dataModel'] = [];
    createModel(dataModel, newJson, '0');
    if (newJson.dataModel.length > 0) {
      try {
        let dataModelStr = JSON.stringify(newJson.dataModel);
        let apisStr = JSON.stringify(newJson.apis);
        for (const model of newJson.dataModel) {
          if (model?.old_model_id) {
            let reg = new RegExp(`"${model.old_model_id}"`, 'g')
            dataModelStr = dataModelStr.replace(reg, `"${model.model_id}"`);
            apisStr= apisStr.replace(reg, `"${model.model_id}"`);
          }
        }
        newJson.apis = JSON.parse(apisStr);
        newJson.dataModel = JSON.parse(dataModelStr);
      } catch (error) { }
    }
  }
}
export const Module2ApiPostFull = (json: any) => {
  const { project, env, apis, dataModel } = json;
  let newJson = {};
  fullProject(newJson, project);
  fullEnv(newJson, env);
  fullAPis(newJson, apis);
  fullDataModel(newJson, dataModel);
  return newJson;
}


export default Module2ApiPostFull;
