import * as React from "react";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Label } from "@fluentui/react/lib/Label";
import Media from "react-bootstrap/Media";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../scss/TOTLandingPage.module.scss";
import siteconfig from "../provisioning/ProvisioningAssets.json";
import commonServices from "../common/CommonServices";
import * as stringsConstants from "../constants/strings";
import TOTLeaderBoard from "./TOTLeaderBoard";
import TOTMyDashboard from "./TOTMyDashboard";
import TOTCreateTournament from "./TOTCreateTournament";
import TOTEnableTournament from "./TOTEnableTournament";
import Navbar from "react-bootstrap/Navbar";
import * as LocaleStrings from 'TotHomeWebPartStrings';
import DigitalBadge from "./DigitalBadge";
import { ThemeStyle } from "msteams-ui-styles-core";
import TOTReport from "./TOTReport";

export interface ITOTLandingPageProps {
  context?: any;
  siteUrl: string;
  isTOTEnabled: boolean;
  firstName: string;
}
interface ITOTLandingPageState {
  showSuccess: Boolean;
  showError: Boolean;
  errorMessage: string;
  dashboard: boolean;
  siteUrl: string;
  siteName: string;
  inclusionpath: string;
  leaderBoard: boolean;
  createTournament: boolean;
  manageTournament: boolean;
  isAdmin: boolean;
  isShowLoader: boolean;
  digitalBadge: boolean;
  tournamentReport: boolean;
}
let commonService: commonServices;
class TOTLandingPage extends React.Component<
  ITOTLandingPageProps,
  ITOTLandingPageState
> {
  constructor(props: ITOTLandingPageProps, state: ITOTLandingPageState) {
    super(props);
    this.state = {
      showSuccess: false,
      showError: false,
      errorMessage: "",
      dashboard: false,
      siteUrl: "",
      siteName: siteconfig.sitename,
      inclusionpath: siteconfig.inclusionPath,
      createTournament: false,
      manageTournament: false,
      leaderBoard: false,
      isAdmin: false,
      isShowLoader: false,
      digitalBadge: false,
      tournamentReport: false,
    };
    commonService = new commonServices(this.props.context, this.props.siteUrl);
    this.redirectTotHome = this.redirectTotHome.bind(this);
  }
  public componentDidMount() {
    this.initialChecks();
  }
  //verify isTOTEnabled props, if already enabled then check admin role and active tournaments
  private async initialChecks() {
    try {
      this.setState({
        isShowLoader: true,
      });
      //if isTOTEnabled is true then just check for role
      if (this.props.isTOTEnabled == true) {
        this.checkUserRole();
        this.createLookupField();
      }
    }
    catch (error) {
      console.error("TOT_TOTLandingPage_componentDidMount_FailedToGetUserDetails \n", error);
      this.setState({ showError: true, errorMessage: stringsConstants.TOTErrorMessage + "while getting user details. Below are the details: \n" + JSON.stringify(error), showSuccess: false });
    }
  }

  //Check current users's is admin from "ToT admin List" and set the UI components accordingly
  private async checkUserRole() {
    try {
      let filterQuery: string =
        "Title eq '" +
        this.props.context.pageContext.user.email.toLowerCase() +
        "'";
      const listItem: any = await commonService.getItemsWithOnlyFilter(
        stringsConstants.AdminList,
        filterQuery
      );
      if (listItem.length != 0) {
        this.setState({ isAdmin: true });
      } else {
        this.setState({ isAdmin: false });
      }
      this.setState({
        isShowLoader: false,
      });
    } catch (error) {
      console.error(
        "TOT_TOTLandingPage_checkUserRole_FailedToValidateUserInAdminList \n",
        error
      );
      this.setState({
        showError: true,
        errorMessage:
          stringsConstants.TOTErrorMessage +
          "while getting user from TOT Admin list. Below are the details: \n" +
          JSON.stringify(error),
        showSuccess: false,
      });
    }
  }

  //Onclick of header Redirect to TOT landing page
  public redirectTotHome() {
    this.setState({
      leaderBoard: false,
      createTournament: false,
      manageTournament: false,
      dashboard: false,
      digitalBadge: false,
    });
  }

  //Create tournament name look up field in Digital badge assets lib
  private async createLookupField() {
    const listStructure: any = siteconfig.libraries;
    //get lookup column        
    await sp.web.lists.getByTitle(stringsConstants.TournamentsMasterList).get()
      .then(async (resp) => {
        if (resp.Title != undefined) {
          let digitalLib = sp.web.lists.getByTitle(
            stringsConstants.DigitalBadgeLibrary
          );
          if (digitalLib != undefined) {
            digitalLib.fields.getByInternalNameOrTitle("Tournament").get()
              .then(() => {
                let imageContext;
                listStructure.forEach(async (element) => {
                  const masterDataDetails: string[] = element["masterData"];
                  for (let k = 0; k < masterDataDetails.length; k++) {
                    //check file exists before adding
                    let fileExists = await sp.web.getFileByServerRelativeUrl("/" + this.state.inclusionpath + "/"
                      + this.state.siteName + "/" + stringsConstants.DigitalBadgeLibrary + "/" + masterDataDetails[k]['Name']).select('Exists').get()
                      .then((d) => d.Exists)
                      .catch(() => false);
                    if (!fileExists) {
                      //unable to resolve the dynamic path from siteconfig/dynamic var, hence the switch case
                      switch (masterDataDetails[k]['Title']) {
                        case "Shortcut Hero":
                          imageContext = fetch(require('../assets/images/Photo_Frame_Shortcuts.png'));
                          break;
                        case "Always on Mute":
                          imageContext = fetch(require('../assets/images/Photo_Frame_Mute.png'));
                          break;
                        case "Virtual Background":
                          imageContext = fetch(require('../assets/images/Photo_Frame_Mess.png'));
                          break;
                        case "Jokester":
                          imageContext = fetch(require('../assets/images/Photo_Frame_Jokes.png'));
                          break;
                        case "Double Booked":
                          imageContext = fetch(require('../assets/images/Photo_Frame_Booked.png'));
                          break;
                      }
                      //upload default badges
                      imageContext.then(res => res.blob()).then((blob) => {
                        sp.web.getFolderByServerRelativeUrl("/" + this.state.inclusionpath + "/"
                          + this.state.siteName + "/" + stringsConstants.DigitalBadgeLibrary).files.add(masterDataDetails[k]['Name'], blob, true)
                          .then((res) => {
                            res.file.getItem().then(item => {
                              item.update({
                                Title: masterDataDetails[k]['Title'],
                                TournamentId: masterDataDetails[k]['TournamentName']
                              });
                            });
                          });
                      });
                    }
                  }//master data loop
                });
              }).catch(async () => {
                //field doesn't exists, hence create it
                await digitalLib.fields.addLookup("Tournament", resp.Id, "Title").then(() => {
                  let imageContext;
                  listStructure.forEach(async (element) => {
                    const masterDataDetails: string[] = element["masterData"];
                    for (let k = 0; k < masterDataDetails.length; k++) {
                      //unable to resolve the dynamic path from siteconfig, hence the switch case
                      switch (masterDataDetails[k]['Title']) {
                        case "Shortcut Hero":
                          imageContext = fetch(require('../assets/images/Photo_Frame_Shortcuts.png'));
                          break;
                        case "Always on Mute":
                          imageContext = fetch(require('../assets/images/Photo_Frame_Mute.png'));
                          break;
                        case "Virtual Background":
                          imageContext = fetch(require('../assets/images/Photo_Frame_Mess.png'));
                          break;
                        case "Jokester":
                          imageContext = fetch(require('../assets/images/Photo_Frame_Jokes.png'));
                          break;
                        case "Double Booked":
                          imageContext = fetch(require('../assets/images/Photo_Frame_Booked.png'));
                          break;
                      }
                      //upload default badges
                      imageContext.then(res => res.blob()).then((blob) => {
                        sp.web.getFolderByServerRelativeUrl("/" + this.state.inclusionpath + "/"
                          + this.state.siteName + "/" + stringsConstants.DigitalBadgeLibrary).files.add(masterDataDetails[k]['Name'], blob, true)
                          .then((res) => {
                            res.file.getItem().then(item => {
                              item.update({
                                Title: masterDataDetails[k]['Title'],
                                TournamentId: masterDataDetails[k]['TournamentName']
                              });
                            });
                          });
                      });
                    }//master data loop
                  });
                });
                await digitalLib.defaultView.fields.add("Tournament");
              });
          }
        }
      })
      .catch((err) => {
        console.error(
          "TOT_TOTLandingPage_createLookField \n",
          JSON.stringify(err)
        );
        this.setState({
          showError: true,
          errorMessage:
            stringsConstants.TOTErrorMessage +
            " while adding lookup field. Below are the details: \n" +
            JSON.stringify(err),
          showSuccess: false,
        });
      });
  }




  public render(): React.ReactElement<ITOTLandingPageProps> {
    return (
      <div className={styles.totLandingPage}>
        {this.state.isShowLoader && <div className={styles.load}></div>}
        <div className={styles.container}>
          {!this.state.leaderBoard &&
            !this.state.createTournament &&
            !this.state.dashboard &&
            !this.state.digitalBadge &&
            !this.state.manageTournament &&
            !this.state.tournamentReport && (
              <div>
                <div className={styles.totHeader}>
                  <span className={styles.totPageHeading}>{LocaleStrings.WelcomeLabel} {this.props.firstName}!</span>
                </div>
                <div className={styles.grid}>
                  <div className={styles.messageContainer}>
                    {this.state.showSuccess && (
                      <Label className={styles.successMessage}>
                        <img src={require('../assets/TOTImages/tickIcon.png')} alt="tickIcon" className={styles.tickImage} />
                        {LocaleStrings.EnableTOTSuccessMessage}
                      </Label>
                    )}
                    {this.state.showError && (
                      <Label className={styles.errorMessage}>
                        {this.state.errorMessage}
                      </Label>
                    )}
                  </div>
                  <h5 className={styles.pageSubHeader}>{LocaleStrings.QuickLinksLabel}</h5>
                  <Row className="mt-4">
                    <Col sm={3} className={styles.imageLayout}>
                      <Media
                        className={styles.cursor}
                        onClick={() =>
                          this.setState({
                            leaderBoard: !this.state.leaderBoard,
                            showSuccess: false,
                          })
                        }
                      >
                        <div className={styles.mb}>
                          <img
                            src={require("../assets/TOTImages/LeaderBoard.svg")}
                            alt={LocaleStrings.TOTLeaderBoardPageTitle}
                            title={LocaleStrings.TOTLeaderBoardPageTitle}
                            className={styles.dashboardimgs}
                          />
                          <div className={styles.center} title={LocaleStrings.TOTLeaderBoardPageTitle}>{LocaleStrings.TOTLeaderBoardPageTitle}</div>
                        </div>
                      </Media>
                    </Col>
                    <Col sm={3} className={styles.imageLayout}>
                      <Media
                        className={styles.cursor}
                        onClick={() =>
                          this.setState({
                            dashboard: !this.state.dashboard,
                            showSuccess: false,
                          })
                        }
                      >
                        <div className={styles.mb}>
                          <img
                            src={require("../assets/TOTImages/MyDashboard.svg")}
                            alt={LocaleStrings.TOTMyDashboardPageTitle}
                            title={LocaleStrings.TOTMyDashboardPageTitle}
                            className={styles.dashboardimgs}
                          />
                          <div className={styles.center} title={LocaleStrings.TOTMyDashboardPageTitle}>{LocaleStrings.TOTMyDashboardPageTitle}</div>
                        </div>
                      </Media>
                    </Col>
                    <Col sm={3} className={styles.imageLayout}>
                      <Media
                        className={styles.cursor}
                        onClick={() => this.setState({ digitalBadge: !this.state.digitalBadge })}
                      >
                        <div className={styles.mb}>
                          <img
                            src={require("../assets/TOTImages/DigitalBadge.svg")}
                            alt={LocaleStrings.DigitalMembersToolTip}
                            title={LocaleStrings.DigitalMembersToolTip}
                            className={styles.dashboardimgs}
                          />
                          <div className={styles.center} title={LocaleStrings.DigitalBadgeLabel}>{LocaleStrings.DigitalBadgeLabel}</div>
                        </div>
                      </Media>
                    </Col>
                  </Row>

                  {this.state.isAdmin && (
                    <div>
                      <h5 className={styles.pageSubHeader}>{LocaleStrings.AdminToolsLabel}</h5>
                    </div>
                  )}

                  {this.state.isAdmin && (
                    <Row className="mt-4">
                      <Col sm={3} className={styles.imageLayout}>
                        <Media className={styles.cursor}>
                          <div className={styles.mb}>
                            <a
                              href={`/${this.state.inclusionpath}/${this.state.siteName}/Lists/Actions%20List/AllItems.aspx`}
                              target="_blank"
                            >
                              <img
                                src={require("../assets/TOTImages/ManageTournamentActions.svg")}
                                alt={LocaleStrings.ManageTournamentActionsToolTip}
                                title={LocaleStrings.ManageTournamentActionsToolTip}
                                className={`${styles.dashboardimgs}`}
                              />
                            </a>
                            <div className={`${styles.center}`} title={LocaleStrings.ManageTournamentActionsLabel}>
                              {LocaleStrings.ManageTournamentActionsLabel}
                            </div>
                          </div>
                        </Media>
                      </Col>
                      <Col sm={3} className={styles.imageLayout}>
                        <Media
                          className={styles.cursor}
                          onClick={() =>
                            this.setState({
                              createTournament: !this.state.createTournament,
                              showSuccess: false,
                            })
                          }
                        >
                          <div className={styles.mb}>
                            <img
                              src={require("../assets/TOTImages/CreateTournament.svg")}
                              alt={LocaleStrings.CreateTournamentPageTitle}
                              title={LocaleStrings.CreateTournamentPageTitle}
                              className={styles.dashboardimgs}
                            />
                            <div className={styles.center} title={LocaleStrings.CreateTournamentPageTitle}>
                              {LocaleStrings.CreateTournamentPageTitle}
                            </div>
                          </div>
                        </Media>
                      </Col>
                      <Col sm={3} className={styles.imageLayout}>
                        <Media
                          className={styles.cursor}
                          onClick={() =>
                            this.setState({
                              manageTournament: !this.state.manageTournament,
                              showSuccess: false,
                            })
                          }
                        >
                          <div className={styles.mb}>
                            <img
                              src={require("../assets/TOTImages/ManageTournaments.svg")}
                              alt={LocaleStrings.ManageTournamentsLabel}
                              title={LocaleStrings.ManageTournamentsLabel}
                              className={styles.dashboardimgs}
                            />
                            <div className={styles.center} title={LocaleStrings.ManageTournamentsLabel}>{LocaleStrings.ManageTournamentsLabel}</div>
                          </div>
                        </Media>
                      </Col>

                      <Col sm={3} className={styles.imageLayout}>
                        <Media className={styles.cursor}>
                          <div className={styles.mb}>
                            <a
                              href={`/${this.state.inclusionpath}/${this.state.siteName}/Lists/ToT%20Admins/AllItems.aspx`}
                              target="_blank"
                            >
                              <img
                                src={require("../assets/TOTImages/ManageAdmins.svg")}
                                alt={LocaleStrings.ManageAdminsToolTip}
                                title={LocaleStrings.ManageAdminsToolTip}
                                className={styles.dashboardimgs}
                              />
                            </a>
                            <div className={styles.center} title={LocaleStrings.ManageAdminsLabel}>{LocaleStrings.ManageAdminsLabel}</div>
                          </div>
                        </Media>
                      </Col>
                      <Col sm={3} className={styles.imageLayout}>
                        <Media className={styles.cursor}>
                          <div className={styles.mb}>
                            <a
                              href={`/${this.state.inclusionpath}/${this.state.siteName}/Digital%20Badge%20Assets/Forms/AllItems.aspx`}
                              target="_blank"
                            >
                              <img
                                src={require("../assets/TOTImages/ManageDigitalBadges.svg")}
                                alt={LocaleStrings.ManageDigitalBadgesLabel}
                                title={LocaleStrings.ManageDigitalBadgesLabel}
                                className={`${styles.dashboardimgs}`}
                              />
                            </a>
                            <div className={`${styles.center}`} title={LocaleStrings.ManageDigitalBadgesLabel}>
                              {LocaleStrings.ManageDigitalBadgesLabel}
                            </div>
                          </div>
                        </Media>
                      </Col>
                      <Col sm={3} className={styles.imageLayout}>
                        <Media
                          className={styles.cursor}
                          onClick={() =>
                            this.setState({
                              tournamentReport: !this.state.tournamentReport,
                              showSuccess: false,
                            })
                          }
                        >
                          <div className={styles.mb}>
                            <img
                              src={require("../assets/TOTImages/TournamentsReport.svg")}
                              alt={LocaleStrings.TournamentReportsPageTitle}
                              title={LocaleStrings.TournamentReportsPageTitle}
                              className={styles.dashboardimgs}
                            />
                            <div className={styles.center} title={LocaleStrings.TournamentReportsPageTitle}>{LocaleStrings.TournamentReportsPageTitle}</div>
                          </div>
                        </Media>
                      </Col>
                    </Row>
                  )}
                </div>
              </div>
            )
          }
          {
            this.state.leaderBoard && (
              <TOTLeaderBoard
                siteUrl={this.props.siteUrl}
                context={this.props.context}
                onClickCancel={() => {
                  this.setState({ leaderBoard: false });
                }}
                onClickMyDashboardLink={() => {
                  this.setState({ dashboard: true, leaderBoard: false });
                }}
              />
            )
          }
          {
            this.state.dashboard && (
              <TOTMyDashboard
                siteUrl={this.props.siteUrl}
                context={this.props.context}
                onClickCancel={() => {
                  this.setState({ dashboard: false });
                }
                }
              />
            )
          }
          {
            this.state.tournamentReport && (
              <TOTReport
                siteUrl={this.props.siteUrl}
                context={this.props.context}
                onClickCancel={() => {
                  this.setState({ tournamentReport: false });
                }}
              />
            )
          }
          {
            this.state.digitalBadge && (
              <DigitalBadge
                siteUrl={this.props.siteUrl}
                context={this.props.context}
                clientId=""
                description=""
                theme={ThemeStyle.Light}
                fontSize={12}
                clickcallback={() => this.setState({ digitalBadge: false })}
                clickcallchampionview={() =>
                  this.setState({ digitalBadge: false })
                }
              />
            )
          }
          {
            this.state.createTournament && (
              <TOTCreateTournament
                siteUrl={this.props.siteUrl}
                context={this.props.context}
                onClickCancel={() => {
                  this.setState({ createTournament: false });
                }}
              />
            )
          }
          {
            this.state.manageTournament && (
              <TOTEnableTournament
                siteUrl={this.props.siteUrl}
                context={this.props.context}
                onClickCancel={() => {
                  this.setState({ manageTournament: false });
                }}
              />
            )}
        </div>
      </div>
    );
  }
}
export default TOTLandingPage;
