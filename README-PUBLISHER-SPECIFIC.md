## EXAMPLE TO SETUP PINTEREST APP
# To interact with any publisher advertiser api we need to create a developer app


Create a Pinterest app by following guidance
1. Log into www.pinterest.com with the account that you’ll use to manage your apps
2. Go to My Apps
3. Select Connect app and complete our request form with your app information
4. Submit your request to get Trial access

For More Details follow the guidance url to setup developer app
    https://developers.pinterest.com/docs/getting-started/set-up-app/#operation/terms_of_service/get

After Creating your app you can see your app under My apps
    ![Developer App](https://decodermind.com/static/img/pinterest.png)

1. Click on your app and get APP_Id, APP_SECRET and other information.
2. Save these in .env file. (These env variable will be available across all app, Developer needs to import these var in config file and use them to communicate with pinterest Api)
3. Redirect Url in app indicates where should pinterest api send response against client cridentials provided in request for oauth2 process

## EXAMPLE TO SETUP TABOOLA APP

Create a Taboola app by following guidance
1. Log into www.taboola.com with the account that you’ll use to manage your apps
2. Go to My Apps
3. Select Connect app and complete our request form with your app information
4. Submit your request to get Trial access

For More Details follow the guidance url to setup developer app
    https://developers.taboola.com/docs/getting-started/set-up-app/#operation/terms_of_service/get

After Creating your app you can see your app under My apps
    ![Developer App](https://decodermind.com/static/img/taboola.png)

1. Click on your app and get APP_Id, APP_SECRET and other information.
2. Save these in .env file. (These env variable will be available across all app, Developer needs to import these var in config file and use them to communicate with taboola Api)
3. Redirect Url in app indicates where should taboola api send response against client cridentials provided in request for oauth2 process