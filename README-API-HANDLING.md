# API Endpoints

List of available routes:

**Linking routes**:

### Required Endpoints Inorder to implement this plugin

This is to initiate Oauth connection between Marin & publishers

1 `GET /api/publishers` - get list of all publisher\
2 `POST /api/oauth` - get oauth url against publisher details provided in req body\
3 `POST /api/publisherAccounts` - get accounts against publisher details provided in req body\

**Publisher routes**:

### Inorder to extend this plugin we need to support publisher endpoints as required

- Tier 1 support support complete CRUD
- Tier 2 support support GET and UPDATE Endpoints
- Tier 3 support support only GET Endpoints
  `GET /api/campaigns` - Get All Campaigns\
  `GET /api/groups` - Get All Groups\
  `GET /api/ads` - Get All Ads\
  `GET /api/keywords` - Get All Keywords\
  `GET /api/properties` - Verify if shopping products are available\
  `GET /api/reporting/public/v1.0/report` - Get snapshot\
  `PUT /api/campaigns` - Edit Campaigns\
  `PUT /api/groups` - Edit Groups\
  `PUT /api/ads` - Edit Ads

**Health routes**:

### Required Endpoints Inorder to implement this plugin

`GET /admin/status/marin-PUBLISHER_NAME-api-service/L1` - check health of this microservice\
`GET /admin/status/marin-PUBLISHER_NAME-api-service/L2` - check health of third party api's\
`GET /admin/status/marin-PUBLISHER_NAME-api-service` - check health of third party api's and this microservice\

**Snapshot routes**:

### Inorder to extend this plugin we need to support publisher reporting endpoints as required

`GET /api/reporting/public/v1.0/report?accountId=***&publisherId=141&startDate=2024-04-13&endDate=2024-07-14&refreshToken=**-A&reportType=group` - implement cost rev to fetch reporting data from publisher\

**Swagger Doc**:

- Start the service
- Access: http://localhost:3333/api/#/docs
