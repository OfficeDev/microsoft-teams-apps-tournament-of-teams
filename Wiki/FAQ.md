### 1. Can we install in an existing site?

 To maintain permissions and access control, current version of TOT is creating a new site. If you wish to install to a specific existing site, you can download the source code and modify the location of SharePoint site the package installs to. This would require a recompile of the package.

### 2. Why is my profile image not updated with Digital Badge?

 This happens when the permissions are not being inherited or approved after deploying package. The users must be able to update their profile images and Graph API permissions must have also been approved during package install. 

 ### 3. Does the app support multiple locales?

 Yes, TOT v1.1 supports the translations for below 12 languages, 

- Arabic (SA)
- Chinese
- Chinese (TW)
- English (US)
- French
- German
- Hebrew
- Japanese
- Korean
- Portuguese (BR)
- Russian
- Spanish

### 4. Does the app support mobile devices?

Yes, TOT v1.1 supports the desktop, mobile and tab devices.

### 5. I see an error 'Failed to sync solution to Teams' or 'Couldn't add app to Teams' when I click on 'Sync to Teams'(Classic App Catalog) or 'Add to Teams'(Modern App Catalog)?

Delete the app from Teams Admin Center and then click on 'Sync to Teams' or 'Add to Teams'.