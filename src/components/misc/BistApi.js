import axios from 'axios'
import { config } from '../../Constants'

export const bistApi = {
  saveBist,
  deleteBist,
  userFavAdd,
  getComments,
  getFavs,
  addBistComment,
  getUserExtrasMe,
  saveUserExtrasMe,
  addShareUser,
  getBalanceOnUser,
  getUserShares,
  saveShare,
  deleteShareOnUser,
  getBists,
  getBistWithHistory,
}

function getFavs(token){
  return instance.get('/api/fav',
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  )
}

function getComments(name, token){
  return instance.get(`/api/bists/${name}/comments`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
}

function userFavAdd(name,token) {
    return instance.post(`/api/fav/${name}`, {}, {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
    })
}

function getBistWithHistory(name,h){
  return instance.get(`/api/bists/${name}/history/${h}`)
}


function getBists() {
  return instance.get(`/api/bists`)
}

function deleteShareOnUser(name,token){
  return instance.post('/api/userextras/deleteShareOnUser/'+name,
      {},{
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
}

function saveShare(share,token){
  return instance.post('/api/userextras/edit',share, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
}

function getUserShares(token) {
  return instance.get(`/api/userextras/me/shares`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
}

function addShareUser(data, token) {
  return instance.post('/api/userextras/me/share', data, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}


function saveBist(bists, token) {
  return instance.post('/api/bists', bists, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function deleteBist(name, token) {
  return instance.delete(`/api/bists/${name}`, {
    headers: {
      'Authorization': bearerAuth(token),
      'Content-type': 'application/json'
    }
  })
}

function getBalanceOnUser(token) {
  return instance.get('/api/userextras/me/balance', {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function addBistComment(name, comment, token) {
  return instance.post(`/api/bists/${name}/comments`, comment, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getUserExtrasMe(token) {
  return instance.get(`/api/userextras/me`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function saveUserExtrasMe(token, userExtra) {
  console.log(userExtra)
  return instance.post(`/api/userextras/me`, userExtra, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

// -- Axios

const instance = axios.create({
  baseURL: config.url.API_BASE_URL
})

instance.interceptors.response.use(response => {
  return response;
}, function (error) {
  if (error.response.status === 404) {
    return { status: error.response.status };
  }
  return Promise.reject(error.response);
});

// -- Helper functions

function bearerAuth(token) {
  return `Bearer ${token}`
}