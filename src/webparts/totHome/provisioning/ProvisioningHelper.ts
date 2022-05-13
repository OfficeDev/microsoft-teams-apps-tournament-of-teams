import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/views";
import ProvisioningAssets from "../provisioning/ProvisioningAssets.json";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";
import * as Constants from "../constants/strings";
//Global Variables
const PackageSolution: any = require("../../../../config/package-solution.json");
let rootSiteURL: string;
let spweb: any;
export default class ProvisioningHelper {
  private spcontext: WebPartContext;
  constructor(spcontext: WebPartContext) {
    this.spcontext = spcontext;
    let absoluteUrl = this.spcontext.pageContext.web.absoluteUrl;
    let serverRelativeUrl = this.spcontext.pageContext.web.serverRelativeUrl;
    //  Set context for PNP  
    //  When App is added to a Teams
    if (serverRelativeUrl == "/")
      rootSiteURL = absoluteUrl;
    //  When app is added as personal app
    else
      rootSiteURL = absoluteUrl.replace(serverRelativeUrl, "");
    //  Set up URL for the site
    rootSiteURL = rootSiteURL + "/" + ProvisioningAssets.inclusionPath + "/" + ProvisioningAssets.sitename;
    spweb = Web(rootSiteURL);
  }
  // Check for provisioning when the app is loaded
  public async checkProvisioning(): Promise<any> {
    return new Promise<any>(async (resolve: (sharePointData: any) => void, reject: (error: any) => void) => {
      try {
        let provisioningFlag: string;
        let appVersion: string;
        console.log(Constants.ProvisioningLog, "Checking if site exists to enable app setup. ");
        //Check if the site exists
        await sp.site.exists(rootSiteURL).then(async (response) => {
          if (response != undefined) {
            //If the site does not exist, show app setup button
            if (!response) {
              resolve(false);
            }
            else {
              //Check whether current user is a site admin
              let isCurrentUserAnAdmin: any = (await spweb.currentUser.get()).IsSiteAdmin;
              console.log(Constants.ProvisioningLog, "Is currentuser an admin ", isCurrentUserAnAdmin);
              //Check for Provisioning flag from SP list and show app setup button if needed
              console.log(Constants.ProvisioningLog, "Checking provisioning flag from app config list. ");
              const item: any[] = await spweb.lists.getByTitle(Constants.AppConfiguration).items.top(1).filter("Title eq 'AppConfiguration'").get();
              if (item.length > 0) {
                provisioningFlag = item[0]["Provisioning"];
                appVersion = item[0]["AppVersion"];
                if (appVersion != PackageSolution.solution.version) {
                  if (isCurrentUserAnAdmin)
                    resolve(false);
                  else
                    resolve(true);
                }
                else {
                  if (provisioningFlag == "true")
                    resolve(true);
                  else if (provisioningFlag == "false" && isCurrentUserAnAdmin)
                    resolve(false);
                }
                console.log(Constants.ProvisioningLog, "Fetched values from app config list. Provisioning ", provisioningFlag, " appVersion ", appVersion);
              }
            }
          }
        });
      }
      catch (error) {
        resolve(false);
        console.error(Constants.ProvisioningExceptionLog, "checkProvisioning. \n", error);
      }
    });
  }
  //Creating the site and lists for the App
  public async createSiteAndLists(): Promise<any> {
    return new Promise<any>(async (resolve: (sharePointData: any) => void, reject: (error: any) => void) => {
      try {
        //Get all lists schema from provisioning assets json file
        const listStructure: any = ProvisioningAssets.lists;
        //Check and create site collection if not exits 
        await this.createSite().then(async (response) => {
          if (response == "Success") {
            const listPromise = [];
            for (let element = 0; element < listStructure.length; element++) {
              const spListTitle: string = listStructure[element]["listName"];
              const spListTemplate = listStructure[element]["listTemplate"];
              const fieldsToCreate: string[] = listStructure[element]["fields"];
              const masterDataToAdd: string[] = listStructure[element]["masterData"];
              const columnsToRename: string[] = listStructure[element]["renameColumns"];
              //Verify List exists
              console.log(Constants.ProvisioningLog, "Checking if list already exists. ", spListTitle);
              await spweb.lists.getByTitle(spListTitle).get().then(async (list) => {
                console.log(Constants.ProvisioningLog, "Checking field exists. ", spListTitle);
                //Verify field exists
                let totalFieldsToCreate = await this.checkFieldExists(spListTitle, fieldsToCreate);
                if (totalFieldsToCreate.length > 0) {
                  console.log(Constants.ProvisioningLog, "Creating list fields. ", spListTitle);
                  //Create columns in the list
                  await this.createListFields(list.Title, totalFieldsToCreate).then(async (resp) => {
                    if (resp == "Success") {
                      console.log(Constants.ProvisioningLog, "Created list fields successfully. ", spListTitle);
                      listPromise.push(true);
                    }
                    else {
                      console.log(Constants.ProvisioningLog, "Failed to create List fields. ", spListTitle);
                      listPromise.push(false);
                    }
                  }).catch((err) => {
                    listPromise.push(false);
                    console.error(Constants.ProvisioningExceptionLog, "createSiteAndLists. \n", err);
                  });
                }
                else {
                  console.log(Constants.ProvisioningLog, "No fields to be created. ", spListTitle);
                  listPromise.push(true);
                }
              }).catch(async () => {
                //Create list if not exists already
                await spweb.lists.add(spListTitle, "", spListTemplate, false).then(async () => {
                  console.log(Constants.ProvisioningLog, "Created list successfully. ", spListTitle);
                  //Indexing Modified Column in a list
                  await spweb.lists.getByTitle(spListTitle).fields.getByTitle("Modified").update({ Indexed: true });
                  console.log(Constants.ProvisioningLog, "Indexed Modified Column.", spListTitle);
                  //Verify field exists
                  let totalFieldsToCreate = await this.checkFieldExists(spListTitle, fieldsToCreate);
                  //Create columns in the list
                  await this.createListFields(spListTitle, totalFieldsToCreate).
                    then(async (result) => {
                      console.log(Constants.ProvisioningLog, "List fields are created successfully. ", spListTitle);
                      if (result == "Success") {
                        //Rename columns in the list
                        await this.renameColumns(spListTitle, columnsToRename).then(async (resp) => {
                          if (resp == "Success")
                            console.log(Constants.ProvisioningLog, "Renamed columns successfully. ", spListTitle);
                          else
                            console.log(Constants.ProvisioningLog, "Failed to rename columns. ", spListTitle);
                        }).catch((err) => {
                          listPromise.push(false);
                          console.error(Constants.ProvisioningExceptionLog, "createSiteAndLists. \n", err);
                        });
                      }
                      //Adding master data to the list
                      let statusOfCreation = await this.createMasterData(spListTitle, masterDataToAdd);
                      let promiseStatus = Promise.all(statusOfCreation);
                      promiseStatus.then(async () => {
                        listPromise.push(true);
                        console.log(Constants.ProvisioningLog, "Master data was added successfully. ", spListTitle);
                      }).catch((err) => {
                        listPromise.push(false);
                        console.error(Constants.ProvisioningExceptionLog, "createSiteAndLists. \n", err);
                      });
                    }).catch((err) => {
                      listPromise.push(false);
                      console.error(Constants.ProvisioningExceptionLog, "createSiteAndLists. \n", err);
                    });
                }).catch((err) => {
                  listPromise.push(false);
                  console.error(Constants.ProvisioningExceptionLog, "createSiteAndLists. \n", err);
                });
              });
            }
            //Check for provisioning error and update the app configuration list accordingly
            Promise.all(listPromise).then(async () => {
              console.log(Constants.ProvisioningLog, "Promises returned for all lists ", listPromise);
              if (listPromise.includes(false)) {
                //Update the app configuration list when there is an error in provisioning
                let list = spweb.lists.getByTitle(Constants.AppConfiguration);
                const items: any[] = await list.items.top(1).filter("Title eq 'AppConfiguration'").get();
                if (items.length > 0) {
                  const item = list.items.getById(items[0].Id).update({
                    Provisioning: "false",
                    AppVersion: PackageSolution.solution.version
                  });
                  console.log(Constants.ProvisioningLog, "App config item updated with Provisioning = false and app version ", PackageSolution.solution.version);
                  reject(false);
                }
              }
              else {
                //Update the app configuration list when the provisioning is successful
                let list = spweb.lists.getByTitle(Constants.AppConfiguration);
                const items: any[] = await list.items.top(1).filter("Title eq 'AppConfiguration'").get();
                if (items.length > 0) {
                  const item = list.items.getById(items[0].Id).update({
                    Provisioning: "true",
                    AppVersion: PackageSolution.solution.version
                  });
                  console.log(Constants.ProvisioningLog, "App config item updated with Provisioning = true and app version ", PackageSolution.solution.version);
                  resolve(true);
                }
              }
            });
          }
          else {
            reject(false);
            console.log(Constants.ProvisioningLog, "Failed to create site. ");
          }
        }).catch((err) => {
          reject(false);
          console.error(Constants.ProvisioningExceptionLog, "createSiteAndLists. \n", err);
        });
      }
      catch (error) {
        reject(false);
        console.error(Constants.ProvisioningExceptionLog, "createSiteAndLists. \n", error);
      }
    });
  }
  // Create PVSS site if not exists
  private async createSite(): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        //Resetting the context to root site
        sp.setup({
          spfxContext: this.spcontext
        });
        console.log(Constants.ProvisioningLog, "Checking if site exists already. ");
        //Check if PVSS site exists
        await sp.site.exists(rootSiteURL).then(async (response) => {
          if (response != undefined) {
            //If PVSS site does not exist, create the site
            if (!response) {
              console.log(Constants.ProvisioningLog, "Creating new site. ", rootSiteURL);
              const createSiteUrl: string = "/_api/SPSiteManager/create";
              const siteDefinition: any = {
                request: {
                  Title: ProvisioningAssets.sitename,
                  Url: rootSiteURL,
                  Lcid: 1033,
                  ShareByEmailEnabled: true,
                  Description: Constants.SiteAppName,
                  WebTemplate: "STS#3",
                  SiteDesignId: "6142d2a0-63a5-4ba0-aede-d9fefca2c767",
                  Owner: this.spcontext.pageContext.user.email,
                },
              };
              const spHttpsiteClientOptions: ISPHttpClientOptions = {
                body: JSON.stringify(siteDefinition),
              };
              //HTTP post request for creating a new site collection
              this.spcontext.spHttpClient
                .post(
                  createSiteUrl,
                  SPHttpClient.configurations.v1,
                  spHttpsiteClientOptions
                )
                .then((siteResponse: SPHttpClientResponse) => {
                  //If site is succesfully created
                  if (siteResponse.status === 200) {
                    console.log(Constants.ProvisioningLog, "Site was created successfully. ");
                    resolve("Success");
                  }
                  else {
                    console.log(Constants.ProvisioningLog, "Failed to create the site. ", siteResponse.status);
                    reject("Failed");
                  }
                }).catch((err) => {
                  console.error(Constants.ProvisioningExceptionLog, "createSite. \n", err);
                  reject("Failed");
                });
            }
            //If PVSS site already exists create only lists. 
            else {
              console.log(Constants.ProvisioningLog, "Site already exists. ");
              resolve("Success");
            }
          }
        });
      }
      catch (error) {
        console.error(Constants.ProvisioningExceptionLog, "createSite.  \n", error);
      }
    });
  }
  //Add master data to list
  private async createMasterData(
    listname: string,
    masterDataToAdd: any
  ): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        //Get list context
        const listContext = await spweb.lists.getByTitle(listname);
        const listItemCount = (await listContext.get()).ItemCount;
        if (listItemCount == 0) {
          let batchProcess = spweb.createBatch();
          const entityTypeFullName =
            await listContext.getListItemEntityTypeFullName();
          switch (listname) {
            case Constants.AdminList:
              //add master data
              listContext.items
                .inBatch(batchProcess)
                .add(
                  { Title: this.spcontext.pageContext.user.email },
                  entityTypeFullName
                );
              await batchProcess.execute();
              break;
            case Constants.ActionsMasterList:
              //create master data
              for (let j = 0; j < masterDataToAdd.length; j++) {
                listContext.items.inBatch(batchProcess).add(
                  {
                    Title: masterDataToAdd[j]["Title"],
                    Category: masterDataToAdd[j]["Category"],
                    Description: masterDataToAdd[j]["Description"],
                    Points: masterDataToAdd[j]["Points"],
                    HelpURL: masterDataToAdd[j]["HelpURL"],
                  },
                  entityTypeFullName
                );
              }
              await batchProcess.execute();
              break;
            case Constants.TournamentsMasterList:
              //add master data
              for (let j = 0; j < masterDataToAdd.length; j++) {
                listContext.items.inBatch(batchProcess).add(
                  {
                    Title: masterDataToAdd[j]["Title"],
                    Description: masterDataToAdd[j]["Description"],
                    Status: masterDataToAdd[j]["Status"],
                  },
                  entityTypeFullName
                );
              }
              await batchProcess.execute();
              break;
            case Constants.TournamentActionsMasterList:
              //add master data
              for (let j = 0; j < masterDataToAdd.length; j++) {
                listContext.items.inBatch(batchProcess).add(
                  {
                    Title: masterDataToAdd[j]["Title"],
                    Category: masterDataToAdd[j]["Category"],
                    Action: masterDataToAdd[j]["Action"],
                    Description: masterDataToAdd[j]["Description"],
                    Points: masterDataToAdd[j]["Points"],
                    HelpURL: masterDataToAdd[j]["HelpURL"],
                  },
                  entityTypeFullName
                );
              }
              await batchProcess.execute();
              break;
             
            
            case Constants.AppConfiguration:
              //Add master data
              for (let j = 0; j < masterDataToAdd.length; j++) {
                listContext.items.inBatch(batchProcess).add(
                  {
                    Title: masterDataToAdd[j]["Title"],
                    Provisioning: masterDataToAdd[j]["Provisioning"],
                    AppVersion: masterDataToAdd[j]["AppVersion"],
                  },
                  entityTypeFullName
                );
              }
              await batchProcess.execute().then(() => {
                console.log(Constants.ProvisioningLog, "Added master data to the list. ", listname);
              }).catch((err) => {
                reject("Failed");
                console.error(Constants.ProvisioningExceptionLog, "createMasterData. \n", err);
              });
              break;            
            default:
          }
        }
        resolve("Success");
      } catch (error) {
        console.error(Constants.ProvisioningExceptionLog, "createMasterData. \n ", error);
        reject("Failed");
      }
    });
  }
  //Validate if the list column already exists
  public async checkFieldExists(
    spListTitle: string,
    fieldsToCreate: string[]
  ) {
    let totalFieldsToCreate = [];
    try {
      const filterFields = await spweb.lists
        .getByTitle(spListTitle)
        .fields.filter("Hidden eq false and ReadOnlyField eq false")
        .get();
      for (let i = 0; i < fieldsToCreate.length; i++) {
        // Compare fields
        const parser = new DOMParser();
        const xml = parser.parseFromString(fieldsToCreate[i], "text/xml");
        let fieldNameToCheck = xml
          .querySelector("Field")
          .getAttribute("DisplayName");
        let fieldExists = filterFields.filter(
          (e) => e.Title == fieldNameToCheck
        );
        if (fieldExists.length == 0) {
          totalFieldsToCreate.push(fieldsToCreate[i]);
        }
      }
      return totalFieldsToCreate;
    } catch (error) {
      console.error(Constants.ProvisioningExceptionLog, "checkFieldExists. \n", error);
    }
  }
  //Create fields in SP lists
  private async renameColumns(listname: string, columnsToRename: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        //Get list context
        const listContext = await spweb.lists.getByTitle(listname);
       // Add all the fields in a single batch call
        const batch = spweb.createBatch();
        for (let i = 0; i < columnsToRename.length; i++) {
          listContext.fields.inBatch(batch).getByTitle(columnsToRename[i]["key"]).update({ Title: columnsToRename[i]["value"], Indexed: true });
        }
        await batch.execute().then(() => {
          resolve("Success");
        }).catch((err) => {
          reject("Failed");
          console.error(Constants.ProvisioningExceptionLog, "renameColumns. \n", err);
        });
      } catch (error) {
        console.error(Constants.ProvisioningExceptionLog, "renameColumns. \n", error);
        reject("Failed");
      }
    });
  }

  //Create fields in SP lists
  private async createListFields(listname: string, fieldsToCreate: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        //Get list context
        const listContext = await spweb.lists.getByTitle(listname);
        // add all the fields in a single batch call
        const batch = spweb.createBatch();
        for (let i = 0; i < fieldsToCreate.length; i++) {
          listContext.fields.inBatch(batch).createFieldAsXml(fieldsToCreate[i]);
        }
        //Execute the batch and add field to default view
        batch.execute().then(async () => {
          let addingStatus = [];
          for (let i = 0; i < fieldsToCreate.length; i++) {
            const parser = new DOMParser();
            const xml = parser.parseFromString(fieldsToCreate[i], 'text/xml');
            let fieldDisplayName = xml.querySelector('Field').getAttribute('DisplayName');
            let listView = await listContext.defaultView.fields.add(fieldDisplayName);
            addingStatus.push(listView);
          }
          Promise.all(addingStatus).then(() => {
            resolve("Success");
          });
        }).catch((err) => {
          reject("Failed");
          console.error(Constants.ProvisioningExceptionLog, "createListFields. \n", err);
        });
      } catch (error) {
        console.error(Constants.ProvisioningExceptionLog, "createListFields. \n", error);
        reject("Failed");
      }
    });
  }
}
