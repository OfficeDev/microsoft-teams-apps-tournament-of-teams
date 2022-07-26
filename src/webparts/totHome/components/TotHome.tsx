import * as React from 'react';
import styles from '../scss/TOTHome.module.scss';
import { sp } from "@pnp/sp/presets/all";
import { Web } from "@pnp/sp/webs";
import "bootstrap/dist/css/bootstrap.min.css";
import Col from "react-bootstrap/Col";
import Media from "react-bootstrap/Media";
import Row from "react-bootstrap/Row";
import { Label, Spinner, SpinnerSize } from "office-ui-fabric-react";
import { initializeIcons } from "@uifabric/icons";
import { ITotHomeProps } from './ITotHomeProps';
import TOTLandingPage from "./TOTLandingPage";
import Header from "./Header";
import ProvisioningHelper from "../provisioning/ProvisioningHelper";
import siteconfig from "../provisioning/ProvisioningAssets.json";
import * as Constants from "../constants/strings";
import * as LocaleStrings from 'TotHomeWebPartStrings';

initializeIcons();
export interface ITotHomeState {
  showError: boolean;
  showSuccess: boolean;
  setupMessage: string;
  isShowLoader: boolean;
  enableTOT: boolean;
  isTOTEnabled: boolean;
  firstName: string;
}
//Global Variables
let rootSiteURL: string;
let spweb: any;
export default class TotHome extends React.Component<ITotHomeProps, ITotHomeState> {

  private provisioningHelper: ProvisioningHelper;

  constructor(_props: any) {
    super(_props);
    this.state = {
      showError: false,
      showSuccess: false,
      setupMessage: "",
      isShowLoader: false,
      enableTOT: false,
      isTOTEnabled: false,
      firstName: "",
    };

    let absoluteUrl = this.props.context.pageContext.web.absoluteUrl;
    let serverRelativeUrl = this.props.context.pageContext.web.serverRelativeUrl;
    if (serverRelativeUrl == "/")
      rootSiteURL = absoluteUrl;
    else
      rootSiteURL = absoluteUrl.replace(serverRelativeUrl, "");
    rootSiteURL = rootSiteURL + "/" + siteconfig.inclusionPath + "/" + siteconfig.sitename;
    sp.setup({
      spfxContext: this.props.context,
    });
    this.provisioningHelper = new ProvisioningHelper(this.props.context);
    spweb = Web(rootSiteURL);
  }


  public componentDidMount() {

    let givenName: any[] = this.props.context.pageContext.user.displayName.split(" ");
    if (givenName.length > 0) {
      this.setState({ firstName: givenName[0].replace(",", "") });
    }
    this.checkProvisioning();
  }

  //Check if the assets are already provisioned or not
  private async checkProvisioning() {

    this.setState({ enableTOT: false, isTOTEnabled: false });
    // Check if the assets are already provisioned or not.
    this.provisioningHelper.checkProvisioning().then((response) => {
      if (response != undefined) {
        if (!response) {
          this.setState({ enableTOT: true });
          console.log(Constants.ProvisioningLog, "enableTOT ", this.state.enableTOT);
        }
        else {
          this.setState({ isTOTEnabled: true });
          console.log(Constants.ProvisioningLog, "isTOTEnabled ", this.state.isTOTEnabled);
        }
      }
    });
  }

  //This function is called when Enable TOT image is clicked, to create a site and all required assets  
  public enableAppSetup = () => {
    this.setState({ isShowLoader: true, setupMessage: LocaleStrings.ProvisioningSetupMessage, enableTOT: false });
    //Creating provisioning assets for the App
    this.provisioningHelper.createSiteAndLists().then((response) => {
      if (response != undefined) {
        if (!response) {
          this.setState({ showError: true, showSuccess: false, enableTOT: true, isShowLoader: false, setupMessage: LocaleStrings.ProvisioningErrorMessage });
          console.log(Constants.ProvisioningLog, "Error in Provisioning. ");
        }
        else {
          this.setState({ showError: false, showSuccess: true, enableTOT: false, isShowLoader: false, setupMessage: LocaleStrings.ProvisioningSuccessMessage });
          console.log(Constants.ProvisioningLog, "Provisioning Successful. ");
        }
      }
    }).catch((err) => {
      this.setState({ showError: true, showSuccess: false, enableTOT: true, isShowLoader: false, setupMessage: LocaleStrings.ProvisioningErrorMessage });
      console.error("PVSS_Home_enableAppSetup. \n ", err);
    });
  }


  public render(): React.ReactElement<ITotHomeProps> {
    return (
      <div className={styles.totHome} >
        <div className={styles.container} >
          <div>
            <Header
              clickcallback={() =>
                this.checkProvisioning()
              }
            />
          </div>
          {this.state.enableTOT && !this.state.showSuccess && (
            <div className={styles.imgheader}>
              <span className={styles.totPageHeading}>{LocaleStrings.WelcomeLabel} {this.state.firstName}!</span>
            </div>
          )}
          <div>
            {
              this.state.isTOTEnabled && (
                <TOTLandingPage
                  siteUrl={this.props.siteUrl}
                  context={this.props.context}
                  isTOTEnabled={this.state.isTOTEnabled}
                  firstName={this.state.firstName}
                />
              )
            }
          </div>
          <div className={styles.background}>
            {this.state.isShowLoader && (
              <Label className={styles.setupMessage}>
                {this.state.setupMessage}
              </Label>
            )}
            {this.state.isShowLoader && (
              <Spinner
                label={LocaleStrings.SpinnerMessage}
                size={SpinnerSize.large}
              />
            )}
            {this.state.showError && (
              <Label className={styles.errorMessage}>
                {this.state.setupMessage}
              </Label>
            )}
            {this.state.showSuccess && (
              <Label className={styles.successMessage}>
                {this.state.setupMessage}
              </Label>
            )}
            {this.state.enableTOT && !this.state.showSuccess && (
              <div>
                <div className={styles.grid}>
                  <Row xl={4} lg={4} md={4} sm={3} xs={2} className="mt-4">
                    <Col xl={3} lg={3} md={3} sm={4} xs={6} className={styles.imageLayout}>
                      <Media
                        className={styles.cursor}
                        onClick={() => this.enableAppSetup()}
                      >
                        <div className={styles.mb}>
                          <img
                            src={require("../assets/TOTImages/EnableTOT.svg")}
                            alt={LocaleStrings.EnableTOTToolTip}
                            title={LocaleStrings.EnableTOTToolTip}
                            className={styles.dashboardimgs}
                          />
                          {!this.state.isTOTEnabled && (<div className={`${styles.center} ${styles.enableTournamentLabel}`} title={LocaleStrings.EnableTOTLabel}>
                            {LocaleStrings.EnableTOTLabel}</div>)}
                        </div>
                      </Media>
                    </Col>
                  </Row>
                </div>
              </div>
            )}
          </div>
        </div >
      </div >
    );
  }
}
