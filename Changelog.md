# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.12.14

### Changed

- Set the `X-Frame-Options` to `SAMEORIGIN` for the silent-refresh.

## 1.12.13

### Changed

- Correct silent refresh for Keycloak Oauth Server
- Redirect to the correct page after reauthentication with the mock server and display the business partner information in a HTML dialog.

## 1.12.12

### Changed

- Product selection is now two-fold: environment is selected first, then products appear below after clicking continue
- No environment is pre-selected; selecting a different environment redirects to that environment's URL with the selection preserved
- Primary (production) environment card can be disabled via `primaryEnvironmentEnabled` functionality config flag

## 1.12.11

### Changed

- use url matching to determine which environment we are on

## 1.12.10

### Fixed

- Token handling from previous 1.12.8 version should now be fixed

## 1.12.9

### Added

- preview product selection card

## 1.12.8

### Fixed

- Fixed token handling after creating new business partner 

## 1.12.7

- Remove business partner trust chip on did detail page

## 1.12.6

- Added preview texts for partner creation

## 1.12.5

### Added

- Added Explainer Screen for adding additional DIDs

## 1.12.4

### Changed

- Make sure the pagination is displayed when there are more than 10 business partners.

## 1.12.3

### Fixed

- Update jeap-spring-boot-parent to 31.4.0 to resolve CVE CVE-2026-22732

## 1.12.2

### Changed

- allow configuration for disabling business partner types

## 1.12.1

### Changed

- Fixed start trust onboarding button not working.

## 1.12.0

### Changed

- Remove UI payment specific information when `payment-enabled` functionality is false.

## 1.11.7

### Changed

- Made base and trust onboarding wizard steppers stateful and linkable

## 1.11.6

### Changed

- Use correct introspection `client-id` for token introspection.

## 1.11.5

### Changed

- Fix broken dynamic links caused by wrong ICU MessageFormat syntax in translation strings

## 1.11.4

### Changed

- Change root url for service navigation on DEV

## 1.11.3

### Changed

- Use lightweight token mode to inspect pruned tokens therefore removing a technical limitation on roles per user.

## 1.11.2

### Fix

- Make linter work again and fix some linting issues

## 1.11.1

### Changed

- Increase parent jeap-spring-boot-parent to 30.19.0 to fix CVE GHSA-72hv-8253-57qq

## 1.11.0

### Changed

- Adapt base and onboarding flows with specific behaviour when automatic trust onboarding approval is enabled on
  swiyu-trust-management-scs site

## 1.10.3

### Fixed

- Shows configured identifier registry api url instead of hardcoded one

## 1.10.2

### Changed

- Fixes card overlap in case of small screen in did details screen

## 1.10.1

### Changed

- Refactored title translation of detail-section component

## 1.10.0

### Changed

- Updated java version from 21 to 25 and jeap parent from 30.10.0 to 30.15.0

## 1.9.23

### Changed

- updated trust onboarding flor for GOV partners

## 1.9.22

### Fixed

- Latest TrustOnboardingSubmission endpoint is now Business Partner aware

## 1.9.21

### Fixed

- Fixes slash duplication on identifier registry DID url

## 1.9.20

### Changed

- updated the gov onboarding flow process

## 1.9.19

### Changed

- updated jeap-spring-boot-parent to 30.10.0
- enabled support for detailed health metrics

## 1.9.18

### Fixed

- Fixed alert full row display in business partner detail view

## 1.9.17

### Fixed

- Rename uid field to uppercase UID so that it is saved by core service

## 1.9.16

### Fixed

- Handle case if no latest trust onboarding present yet
- Fix identifier api url path

## 1.9.15

### Fixed

- routing to new business partners ui is now also feature toggled

## 1.9.14

### Added

- Added data-cy attributes

## 1.9.13

### Fixed

- removed wrong unknown/start routing

## 1.9.12

### Fixed

- Refactored did-details component to use detail-section component, fixed some issues, extended detail-section with
  external links

## 1.9.11

### Fixed

- Fix starting trust onboarding not working due to missing partner ID

## 1.9.10

### Changed

- Fixed truncated text display in business partner detail view

## 1.9.9

### Changed

- Changed data-cy attributes in some fields

## 1.9.8

### Added

- Add DID-setup page

## 1.9.7

### Added

- Add radio-card component based on general design

## 1.9.6

### Added

- Add development handover step to base onboarding flow

## 1.9.5

### Fixed

- Fixed client id for oauth2 configuration

## 1.9.4

### Fixed

- English is now selectable as UI language

## 1.9.3

### Fixed

- default resource id is now bj-swiyu-ecosystem as configured in mock and real oauth server

## 1.9.2

### Fixed

- Register onboarding step translation keys in translateSetup to preserve them during i18n cleanup

## 1.9.1

### Added

- Partner profile detail page

## 1.9.0

### Added

- Partner registration view and welcome redirect component, which directs user to partner registration if no
  business partner is associated with the user.

## 1.8.2

### Added

- added data-cy attribute for onboarding fields

## 1.8.1

### Changed

- Cleanup app routes

## 1.8.0

### Added

- integrate service navigation into eportal

### Changed

- Make translations mandatory in build process

## 1.7.2

### Changed

- fixed loading of user profile

## 1.7.1

### Changed

- adapt feature toggle to allow old and new onboarding
- Cleanup routing logic

## 1.7.0

### Added

- Add business partner detail view

## 1.6.0

### Added

- UserProfile is now loaded after login via /api/user-profile. The UserProfile contains the information whether
  the user is within the governmental allowlist or not.

## 1.5.1

### Changed

- REST Endpoints are now secured by checking against the following roles:
    - ti*@trustonboardingsubmission*@read
    - ti*@trustonboardingsubmission*@write
    - ti*@identifier*#read
    - ti*@identifier*#write
    - ti*@businesspartner*#read
    - ti*@businesspartner*#write

## 1.5.0

### Changed

- Add partner profile creation

## 1.4.7

### Changed

- Internal UI refactoring around sw-page-container class

## 1.4.6

### Added

- Added static payment success screen

## 1.4.5

### Added

- Added data-cy to buttons

## 1.4.4

### Changed

- Fixed navigation on environment selection

## 1.4.3

### Changed

- PAMS_APP_ID is now a required env variable. The hardcoded PAMS-ID 301344 is removed.

## 1.4.2

### Changed

- Fix some sonar findings

## 1.4.1

### Changed

- Update ch.admin.bit.jeap:jeap-spring-boot-parent from 28.3.0 to 30.2.0

## 1.4.0

### Added

- Implement business partner admin overview page / switch to table concept

## 1.3.5

### Added

- Did Detail page

## 1.3.4

- fix onboarding stepper not advancing after successful submission

## 1.3.3

### Added

- add success badge when all proofs of possessions for an onboarding submission are valid.

## 1.3.2

### Changed

- fixed routing in trust onboarding introduction

## 1.3.1

### Changed

- change frontend validation of technical step to backend validation

## 1.3.0

### Added

- environment and product selection in base onboarding

## 1.2.38

### Changed

- only load trust onboarding submissions if user already has registered an organisation

## 1.2.37

### Added

- Base onboarding Skeleton

## 1.2.36

### Changed

- fixed step validation in trust onboarding flow

## 1.2.35

### Added

- Add technical verification step UI

## 1.2.34

### Added

- add data-cy attributes

## 1.2.33

### Changed

- Ignoring sonar issue for the moment which will be solved in upcoming story EID-5292

## 1.2.32

### Changed

- Update core internal api definition to provide business partner type for later promotion in base onboarding flow

## 1.2.31

### Changed

- Update org.openapitools:jackson-databind-nullable from 0.2.7 to 0.2.8
- Update org.openrewrite.maven:rewrite-maven-plugin from 6.19.0 to 6.23.0
- Update com.diffplug.spotless:spotless-maven-plugin from 2.46.1 to 3.1.0
- Update ch.admin.bit.jeap:jeap-spring-boot-parent from 27.3.0 to 28.3.0

## 1.2.30

### Added

- Add technical verification step UI

## 1.2.29

### Added

- add data-cy attributes

## 1.2.28

### Changed

- Service now uses input stream directly in trust onboarding document upload

## 1.2.27

### Added

- add letter of intent onboarding step including file upload

## 1.2.26

### Added

- add data-cy attributes

## 1.2.25

### Changed

- Upgraded to Oblique 14 and Angular 20

## 1.2.24

### Changed

- updated to latest core business api spec where Page is replaced by PagedModel

## 1.2.23

### Changed

- Use internal identifier endpoint instead of b2b one which caused 403 error before

### Changed

- Update Trust onboarding status chip

## 1.2.22

### Changed

- Update local setup to fix port clashes

## 1.2.21

### Changed

- Update maven from 3.9.10 to 3.9.11
- Update org.openapitools:openapi-generator-maven-plugin from 7.14.0 to 7.15.0
- Update org.apache.maven.plugins:maven-surefire-plugin from 3.5.2 to 3.5.4
- Update org.openapitools:jackson-databind-nullable from 0.2.6 to 0.2.7
- Update com.rudikershaw.gitbuildhook:git-build-hook-maven-plugin from 3.5.0 to 3.6.0
- Update org.openrewrite.maven:rewrite-maven-plugin from 6.12.1 to 6.19.0
- Update com.diffplug.spotless:spotless-maven-plugin from 2.45.0 to 2.46.1
- Update ch.admin.bit.jeap:jeap-spring-boot-parent from 27.1.1 to 27.2.0

## 1.2.20

### Changed

- feature toggle EIDARTFE_1122 can now be toggled via env variable FEATURES_EIDARTFE_1122

## 1.2.19

### Changed

- updated jeap-spring-boot-parent to 27.3.0

## 1.2.18

### Changed

- improved test coverage and solved sonar findings

## 1.2.17

### Added

- add MVP for new trust onboarding flow. Enabled by feature flag: EIDARTFE_1122

## 1.2.16

### Changed

- updated to latest jeap (which fixes CVE-2025-48989)

## 1.2.15

### Changed

- font is now loaded and does not result in 401 anymore

## 1.2.14

### Changed

- do not use enforced path segments for resources

## 1.2.13

### Changed

- Update maven from 3.9.9 to 3.9.10
- Update org.codehaus.mojo:build-helper-maven-plugin from 3.6.0 to 3.6.1
- Update org.openapitools:openapi-generator-maven-plugin from 7.13.0 to 7.14.0
- Update org.springframework.security:spring-security-crypto from 6.5.0 to 6.5.1
- Update org.openrewrite.maven:rewrite-maven-plugin from 6.9.0 to 6.12.1
- Update com.diffplug.spotless:spotless-maven-plugin from 2.44.4 to 2.45.0
- Update ch.admin.bit.jeap:jeap-spring-boot-parent from 26.50.1 to 26.68.0

## 1.2.12

### Other

- Update Interface Summaries

### Added

- new data-cy html attribute to locate the organization table for the front-end tests

## 1.2.11

### Changed

- Downgrade maven-surefire-plugin due to archunit incompatibility

## 1.2.10

### Changed

- Update maven from 3.9.7 to 3.9.9
- Update org.springframework.security:spring-security-crypto from 6.4.4 to 6.5.0
- Update org.openapitools:openapi-generator-maven-plugin from 7.7.0 to 7.13.0
- Update org.openrewrite.maven:rewrite-maven-plugin from 5.4.2 to 6.9.0
- Update com.tngtech.archunit:archunit-junit5 from 1.3.0 to 1.4.1
- Update ch.admin.bit.jeap:jeap-spring-boot-parent from 26.41.0 to 26.50.1

## 1.2.9

### Other

- Added spotless plugin

## 1.2.8

### Changed

- Set ui language based on url param so that eportal language is used when user navigates to the swiyu portal

## 1.2.7

### Changed

- Update openapi-generator-cli version to fix CVE-2025-27152

## 1.2.6

### Changed

- Adapt mail validation to use angular default Validators.email

## 1.2.5

### Changed

- Adapt mail template. Use "gemäss" instead of "gem" language

## 1.2.4

### Changed

- Adapt mail template. Use "preferred" instead of "default" language

### Added

- healthcheck of core business service as part of own health status

## 1.2.3

### Changed

- Internal UI improvements

## 1.2.2

### Changed

- Adapt onboarding mail template. Add missing language fr and add sample for did format

## 1.2.1

### Changed

- Display general error from backend as well which weren't sent over the excetiotn handler

## 1.2.0

### Added

- Now supports update of organisation name property.

## 1.1.10

### Changed

- Update jeap spring boot parent to latest version and exclude spring-security-crypto due to CVE-2025-22228

## 1.1.9

### Changed

- Renamed variable from STAGE to BANNER, because the sole usage is the oblique banner value. BANNER env variable is
  optional

## 1.1.8

### Changed

- Upgrade to Spring Boot Parent 26.38.0 to resolve CVE-2025-24813

## 1.1.7

### Changed

- Remove contact section from header widget because we don't wish to be contacted

## 1.1.6

### Changed

- Update translation in help section in header widget

## 1.1.5

### Changed

- Update mail validation to conform with html5 email validation

## 1.1.4

### Changed

- Updated different translations concerning legal texts/links

## 1.1.3

### Changed

- Updated different translations / overall naming and disable token refresh for local development because it is not
  supported by mockserver

## 1.1.2

### Fixed

- /actuator/prometheus is not any longer invoking health indicators

## 1.1.1

### Fixed

- Set connection timeout, read timeout and max redirects for rest client.

## 1.1.0

### Added

- Extending prometheus export with metrics for build

## 1.0.0

- Initial Release
