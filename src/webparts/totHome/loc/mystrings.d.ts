declare interface ITotHomeWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;

  //DigitalBadge
  DigitalBadgePageTitle: string;
  LoadingSpinnerLabel: string;
  DigitalBadgeAppBannerAltText: string;
  PreAcceptPageTitle: string;
  PreAcceptDisclaimer: string;
  PreAcceptDisclaimer2: string;
  NotQualifiedPreAcceptDisclaimer: string;
  HowtoGetDigitalBadgeText: string;
  MultipleBadgeMessage: string;
  NoBadgeMessage: string;
  DigitalBadgeSubPageTitle: string;
  ProfileImageAlt: string;
  BadgeImageAlt: string;
  NoProfileImageAlt: string;
  ApplyButtonText: string;
  ApplyButtonAriaDescription: string;
  ApplyButton: string;
  DownloadButtonText: string;
  DownloadButtonAriaDescription: string;
  DownloadingButtonText: string;
  DownloadedButtonText: string;
  DownloadedButtonSecondaryText: string;
  DownloadButtonSecondaryText: string;
  PreApplyDisclaimer: string;
  PreApplyDisclaimer1: string;
  NoProfileImageDescription: string;
  AcceptButtonText: string;
  AcceptButtonAriaDescription: string;
  UnauthorizedText: string;
  ApplySpinnerLabel: string;
  DigitalBadgeSuccessMessage: string;
  DigitalMembersToolTip: string;
  DigitalBadgeLabel: string;
  AdminToolsLabel: string;

  //Header
  AppHeaderTitleLabel: string;
  AppLogoToolTip: string;
  MoreInfoToolTip: string;
  SupportToolTip: string;
  FeedbackToolTip: string;
  WelcomeLabel: string;

  //More Info Icon Content
  AboutHeaderLabel: string;
  AboutContentLabel: string;
  AdditionalResourcesHeaderLabel: string;
  AdditionalResourcesContentLabel: string;
  M365ChampionCommunityLinkLabel: string;
  DrivingAdoptionLinkLabel: string;
  CurrentVersionLabel: string;
  LatestVersionLabel: string;
  TOTGitHubLinkLabel: string;
  VisitLabel: string;
  OverviewLabel: string;
  MSAdoptionHubLinkLabel: string;
  DocumentationLabel: string;

  //-------------------------------------TOT-------------------------------------------------

  // Common
  SaveButton: string;
  BackButton: string;
  EnableTOTToolTip: string;
  EnableTOTLabel: string;

  // Create Tournament
  CreateTournamentPageTitle: string;
  CreateTournamentSuccessLabel: string;
  TournamentNameLabel: string;
  TournamentNameErrorLabel: string;
  TournamentDescriptionLabel: string;
  TournamentDescPlaceHolderLabel: string;
  SelectTeamsActionsLabel: string;
  TeamsActionInfoToolTip: string;
  ActionErrorLabel: string;
  CreateTournamentButton: string;
  DuplicateTournamentNameError: string;

  //TOT Common
  TOTBreadcrumbLabel: string;

  //TOT Landing
  EnableTOTSuccessMessage: string;
  TOTLeaderBoardPageTitle: string;
  TOTMyDashboardPageTitle: string;
  ManageTournamentActionsToolTip: string;
  ManageTournamentActionsLabel: string;
  EndCurrentTournamentLabel: string;
  ManageTournamentsLabel: string;
  ManageAdminsToolTip: string;
  ManageAdminsLabel: string;
  ManageDigitalBadgesLabel: string;
  QuickLinksLabel: string;

  //Enable Tournament
  ManageTournamentsPageTitle: string;
  ManageToTLabel1: string;
  ManageToTLabel2: string;
  EndTournamentDialogMessage: string;
  StartTournamentDialogMessage: string;
  ConfirmLabel: string;
  YesButton: string;
  NoButton: string;
  ActiveTournamentLabel: string;
  EndTournamentButton: string;
  StartTournamentHeaderLabel: string;
  NoTournamentMessage: string;
  SelectTournamentMessage: string;
  NoActiveTournamentMessage: string;
  SelectEndTournamentMessage: string;
  StartTournamentButton: string;
  EndTournamentSuccessMessage: string;
  EnableTournamentSuccessMessage: string;
  CompleteTournamentSpinnerMessage: string;

  // TOT LeaderBoard & TOT My Dashboard
  NoActiveParticipantsMessage; string;
  NoActiveTournamentMessage: string;
  TournamentLabel: string;
  DescriptionLabel: string;
  NoActiveParticipantsErrorMessage: string;
  PendingActionsLabel: string;
  PendingActionsSuccessMessage: string;
  SelectActionsErrorMessage: string;
  FormSavingMessage: string;
  CompletedActionsLabel: string;
  RankLabel: string;
  UserLabel: string;
  MyDashboardInfoIconMessage: string;
  SelectTournamentPlaceHolder: string;
  MyTournamentsLabel: string;
  OrLabel: string;
  MyTournamentsTooltip: string;

  //TOT SideBar
  PointsLabel: string;
  TournamentRankLabel: string;
  ParticipantsLabel: string;

  //TOT Report
  TournamentReportsPageTitle: string;
  TotalActivitiesLabel: string;
  TotalPointsLabel: string;
  TotalParticipantsLabel: string;
  TotalPercentageCompletionLabel: string;
  Top5ParticipantswithPointsLabel: string;
  Top5TournamentswithParticipantsLabel: string;
  ParticipantsStatusLabel: string;
  ParticipantsDetailsLabel: string;
  NameLabel: string;
  PercentageTournamentCompletedLabel: string;
  ActivitiesCompletedLabel: string;
  NoRecordsinGridLabel: string,
  SearchPlaceholder: string,
  NoCompletedTournamentsMessage: string,
  ReportsDropdownInfoIconText: string,
  RefreshIconInfoText: string,


  //-----------------------------------------------------------------------------------------
  //Provisioning
  ProvisioningErrorMessage: string,
  ProvisioningSuccessMessage: string,
  SpinnerMessage: string,
  ProvisioningSetupMessage: string

}

declare module 'TotHomeWebPartStrings' {
  const strings: ITotHomeWebPartStrings;
  export = strings;
}
