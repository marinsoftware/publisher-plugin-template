import axios from 'axios';


function valueToString (value: any) {
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return value;
}


async function remote_post(axios_config: any) {
  return new Promise((resolve, reject) => {
    axios(axios_config)
      .then(res => {
        resolve(valueToString(res.data));
      })
      .catch(error => {
        reject(error)
      });
  })
}
  
async function remote_get(axios_config: any) {
  return new Promise((resolve, reject) => {
    axios(axios_config)
      .then(res => {
        resolve(valueToString(res.data));
      })
      .catch(error => {
        reject(error)
      });
  })
}

export { remote_post, remote_get };
