## Content of .env file

Create a `.env` file on the root directory of the project.
Content: 

REACT_APP_BASE_URL='<API_URL>' without trailing slash `/`   
REACT_APP_GOOGLE_CLIENT_ID='<CLIENT_ID>'   
REACT_APP_AGORA_RTC_LOG_LEVEL=0     
REACT_APP_AGORA_RTM_LOG_ENABLED=true     

### Example

1. REACT_APP_BASE_URL='https://api.endpoint'
2. REACT_APP_BASE_URL='https://8.8.8.8'

## Run App

`npm start` and navigate to http://localhost:3000

## Build App

`npm build`
