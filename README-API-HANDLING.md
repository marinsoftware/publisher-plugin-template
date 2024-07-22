### API Endpoints
List of available routes:

****Linking routes**:\
# Required Endpoints Inorder to implement this plugin

1 `GET /api/publishers` - get list of all publisher\
2 `POST /api/oauth` - get oauth url against publisher details provided in req body\
3 `POST /api/publisherAccounts` - get accounts against publisher details provided in req body\

**Publisher routes**:\

# Inorder to extend this plugin we need to support publisher endpoints as required
# for Tier 1 support support complete CRUD
# for Tier 2 support support GET and UPDATE Endpoints
# for Tier 3 support support only GET Endpoints
`GET /api/campaigns` - Get All Campaigns\
`GET /api/groups` - Get All Groups\
`GET /api/ads` - Get All Ads\
`GET /api/keywords` - Get All Keywords\
`GET /api/properties` - Verify if shopping products are available\
`GET /api/reporting/public/v1.0/report` - Get snapshot\
`PUT /api/campaigns` - Edit Campaigns\
`PUT /api/groups` - Edit Groups\
`PUT /api/ads` - Edit Ads

**Health routes**:\

# Required Endpoints Inorder to implement this plugin
`GET /admin/status/marin-taboola-api-service/L1` - check health of this microservice\
`GET /admin/status/marin-taboola-api-service/L2` - check health of third party api's\
`GET /admin/status/marin-taboola-api-service` - check health of third party api's and this microservice\

 **Snapshot routes**:\

# Inorder to extend this plugin we need to support publisher reporting endpoints as required
 `GET /api/reporting/public/v1.0/report?accountId=***&publisherId=141&startDate=2024-04-13&endDate=2024-07-14&refreshToken=**-A&reportType=group` - implement cost rev to fetch reporting data from publisher\


## API Handling

`GET /publishers` - get list of all publisher\

    > Open your /src/config/publisher.json
    > Add a publisher you want to interact with for example
    > [
    > {

        "publisher": "GENERIC",
        "publisherDefinition": "TABOOLA",
        "authenticationType": "OAUTH2",
        "linkingParamValList": [
        {
            "fieldName": "accountName",
            "fieldValueType": "String",
            "localizedText": "Account Name",
            "localizedTextKey": "ACCOUNT_NAME_LABEL",
            "required": false
        },
        {
            "fieldName": "accountId",
            "fieldValueType": "String",
            "localizedText": "Account Id",
            "localizedTextKey": "ACCOUNT_ID",
            "required": true
        }
        ]
    }
    ]

    - publisherDefinition : PUBLISHER NAME
    - authenticationType: AUTH TYPE
    - linkingParamValList: List of attribute that we need to ask user from frontend, so we can search the account based upon those information

    Once above publisher is added in json file, your first API will start giving you response

    `POST /oauth` - get oauth url against publisher details provided in req body\
    Once you have setup your .env file as per the directions given in Environment Variables section. This endpoint will start giving you required auth URL.

    URL PARAMS
        1. scope: In taboola we need to provide scope variable in url param. This is a comma delimited list of scope names covering the specific data and/or functions you want to access for this user. You must request access to at least one scope.
        2. client_id: This is the unique ID for your app also referred to as App ID.
        3. redirect_uri: This must be one of the redirect URIs registered on your app. The value of this parameter must exactly  match the registered value.
        4. response_type: Set this value to the literal string code
        5. state(optional): This parameter can be any string value defined by you.

    `POST /publisherAccounts` - get accounts against publisher details provided in req body\
    To return token and account details, you need to customized the controller, as you need to interact with publisher interal API

## API AUTH CURL REQUESTS

  # Request 1
  # List all active Publisher
  curl -X 'GET' 'http://localhost:3333/publishers' -H 'accept: application/json'
  ​
  ​
  # Request 2
  # Retrieve encoded auth URL for valid publisher
  curl -X 'POST' 'http://localhost:3333/oauth' -H 'accept: application/json' -H 'Content-Type: application/json' -d '{ "state": "Unknown Type: Any", "publisher": "TABOOLA", "clientID": "any", "redirect_uri": "https://cloudfunc15-frontend-101.aws.marinsw.net/transientPage"}'
  ​
  ​
  ​
  # Request 3
  # use auth_code or code value comes back from auth url after authorization in code key under request body
  # Retrieve publisher Accounts
  curl -X 'POST' \
    'http://localhost:3333/publisherAccounts' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "responseUrl": "https://marin.com",
    "publisher": "TABOOLA",
    "redirect_uri": `redirect_uri`,
    "accountID": `accountID`,
    "accountName": `accountName`,
    "clientID": `clientID`,
    "code": `code`
  }'