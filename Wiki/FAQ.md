### 1. Can we install in an existing site?

 To maintain permissions and access control, current version of TOT is creating a new site. If you wish to install to a specific existing site you can download the source code and modify the location of SharePoint site the package installs to. This would require a recompile of the package.

### 2. Why is my profile image not updated with Digital Badge?

 This happens when the permissions are not being inherited or approved after deploying package. The users must be able to update their profile images and Graph API permissions must have also been approved during package install. 
