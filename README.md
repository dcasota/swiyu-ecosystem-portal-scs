# SWIYU Ecosystem Portal

## Getting Started

To start the application locally run the following command:

```shell
mvn install # will also build the ui
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Add the `mock-registration-service` profile as well, if you wish to mock the communication with the core business
service for the registration.

### PAMS API Proxy

To use/test the service navigation in local development please use the pams API proxy.
see: https://bitbucket.bit.admin.ch/projects/EPORTAL/repos/pams-proxy/browse/readme.md?at=refs/heads/master

after install you can use the following command to start your local proxy:

```shell
$ pams-proxy --env=ref --level S2Plus --host \
  --uuid <YOUR_ePORTAL_UUID> 
```

Replace <YOUR_ePORTAL_UUID> with your users eportal id (see: https://eportal-r.admin.ch/profile/details)
If you set the env variables you could use the following command:

```shell
$ pams-proxy --uuid $AUTH_PAMS_USER_ID --qa $AUTH_PAMS_QA --host https://portal-r.trust-infra.swiyu.admin.ch --level S2Plus --env=ref  
```