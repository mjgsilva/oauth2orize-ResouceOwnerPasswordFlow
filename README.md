# oauth2orize-ResouceOwnerPasswordFlow
This is an example how to implement the Resource Owner Password Flow (OAuth2) using NodeJS with auth2orize module. 
This flow is simple and fits great if your intention is to build a secure API for mobile clients (first party apps).
(http://oauthlib.readthedocs.org/en/latest/oauth2/grants/password.html)

**Very important notes:**
- You should use a secure layer (HTTPS). In my case I delegate that work to nginx, but if you want to expose your API directly using NodeJS you should 
use https instead of http (app.js, line 35). You can find more information here in how to read certificate files and so: http://nategood.com/nodejs-ssl-client-cert-auth-api-rest.
- In this example all the errors are being displayed. This is not a secure way to handle errors, assume this just for development proposes.

##How to install:
- npm install
- (optional) change port (app.js, line 35)
- (optional) edit mongo connection conf file (models/db.js) - Default: 127.0.0.1:3545, db: auth

##How to use:
####Register client: [Unprotected endpoint - any user can add a client. This is just an example, do a validation in order to reject a new client if there's one already]
```
curl -v -H  "Content-Type: application/json" -X POST http://127.0.0.1:3545/api/client -d '{"name": "iOS-Client"}'
```  
Expected result format: ```{"id":"ccbES5HbBclbkcGyb44dwbBXb","secret":"bucjcXbkdVc2chbDckchDcgeed5cJbS4UdYcPb9dYcGbNcDd4b"}```

####Register a user
```
curl -v -H "Content-Type: application/json" -X POST http://127.0.0.1:3545/api/user -d '{"name": "John Doe", "username": "johndoe", "email": "johndoe@mail.com" , "password": "qwerty"}'
```  
Expected result format: ```{"user_registration":"success"}``` 

####Get Token [-u clientId:clientSecret (generated on step 1)]
```
curl -v -H "Content-Type: application/json" -X POST http://127.0.0.1:3545/api/token -u ccbES5HbBclbkcGyb44dwbBXb:bucjcXbkdVc2chbDckchDcgeed5cJbS4UdYcPb9dYcGbNcDd4b -d '{"username": "johndoe", "password": "qwerty", "grant_type": "password"}'
```  
Expected result format: ```{"access_token":"bkd2cbbBb3dgctcageM4Pb9d5cLdCOcncbbyd2P8cs7DdsbbSdA0bFbDjdHdqfbjcUbLhbSbt6cX6b4IbSd8dabGIdscJKCdWbfc","refresh_token":"bnbJbXbmbmNXGdqMcVdIjdKfeNcwigcGbNdAcAcTOcZcwdWdzKcj6cgbTodLbyLbugbkcfdMdKYdXm2bvbCrdZcxc7QdnIctbbld","token_type":"Bearer"}``` 

####Renew Token [-u clientId:clientSecret / refresh_token generated before]
```
curl -X POST http://127.0.0.1:3545/api/token -u ccbES5HbBclbkcGyb44dwbBXb:bucjcXbkdVc2chbDckchDcgeed5cJbS4UdYcPb9dYcGbNcDd4b -v -H "Content-Type: application/json" -d '{"grant_type": "refresh_token", "refresh_token": "TdBdsbzbSbqcUKi2d2cqdpb7cEdncMdXbzsdqceezcidS8bDybdbzbKbacwdoddd29czctblYdMccc2bzblcOblcMdIdPdvdaRdQ"}'
```  
Expected result format: ```{"access_token":"cfcdelbudtbdLvbbbyLbrbObXcNKduq6b9YBAdLcdmFbvd6b9HdPcDdTqdebddbKb4dGIdMesdGcGbUUbwc6svddeLdQcq9c8bFd","refresh_token":"bnbJbXbmbmNXGdqMcVdIjdKfeNcwigcGbNdAcAcTOcZcwdWdzKcj6cgbTodLbyLbugbkcfdMdKYdXm2bvbCrdZcxc7QdnIctbbld","token_type":"Bearer"}``` 

####Access protected endpoint (the new access_token provided by renew token feature)
```
curl -X GET http://127.0.0.1:3545/api/profile -v -H "Authorization: Bearer cfcdelbudtbdLvbbbyLbrbObXcNKduq6b9YBAdLcdmFbvd6b9HdPcDdTqdebddbKb4dGIdMesdGcGbUUbwc6svddeLdQcq9c8bFd"
```  
Expected result format: ```{"name":"John Doe","created":"2015-01-10T23:32:26.635Z"}``` 

####Logout (delete token)
```
curl -X POST http://127.0.0.1:3545/api/logout -v -H "Authorization: Bearer cfcdelbudtbdLvbbbyLbrbObXcNKduq6b9YBAdLcdmFbvd6b9HdPcDdTqdebddbKb4dGIdMesdGcGbUUbwc6svddeLdQcq9c8bFd"
"
```  
Expected result format: ```{"logout":"success"}``` 
