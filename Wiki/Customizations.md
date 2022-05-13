# Customizations

The customized installation makes the assumption you wish to change the default variables (site name, list names, labels, buttons text, logo etc.) with the Tournament of Teams Solution Template. Customizing the installation takes it outside of configurations we have tested against but allows you to modify any aspect of the template. 

```
Please note that if you customize the solution according to your organization needs, there are chances that you might face challenges while upgrading to new versions with the future releases.
```

## Prerequisites 

1. Install Visual Studio Code
1. Clone the app [repository](https://github.com/OfficeDev/microsoft-teams-apps-tournament-of-teams.git) locally.

Below are the high level steps to get you started on customizing the template.

## Site Name Customization

1.  Open `ProvisioningAssets.json` under `src\webparts\totHome\provisioning` 
1.  Modify the 'sitename' property as per your requirement.
    
    ![Customization](../Images/Customization1.png)     

    
## List Names and Field Names Customization

1. Open `ProvisioningAssets.json` under `src\webparts\totHome\provisioning` 
1. To modify a list name change the "listName" property of the specific list under "lists" node.
1. To modify a field name change the "fields" property under the "lists" node.
1. Modify the code in the component which is linked to the list/field and test to make sure the functionality is not breaking.

![Customization](../Images/Customization2.png)   

## Button/Label/Title text customization

1. Open `en-us.js` under `src\webparts\totHome\loc` 
1. The text for all buttons, labels,titles, messages are listed in this file grouped by components.
1. Find and modify the text as per needs.

![Customization](../Images/Customization4.png)     

## Customize the app logo from manifest

1. Navigate to `teams` folder under the project.<br>
![Customization](../Images/Customization3.png)  
1. Replace the below two images with new image files. Make sure the new images are also in png format.<br>
color.png <br>
outline.png
1. Delete the "TeamsSPFxApp.zip" folder and create a new zip folder with the images and the manifest file in the same location with the same name.
1. Generate a new package file and follow the deployment instructions in the deployment guide.

