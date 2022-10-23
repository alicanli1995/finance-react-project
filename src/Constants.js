const prod = {
  url: {
    KEYCLOAK_BASE_URL: "https://dene231.herokuapp.com/auth",
    API_BASE_URL: 'https://finance-app-last.herokuapp.com/',
    AVATARS_DICEBEAR_URL: 'https://avatars.dicebear.com/api'

  }
}

const dev = {
  url: {
    KEYCLOAK_BASE_URL: "https://dene231.herokuapp.com/auth",
    API_BASE_URL: 'https://finance-app-last.herokuapp.com/',
    AVATARS_DICEBEAR_URL: 'https://avatars.dicebear.com/api'
  }
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod
