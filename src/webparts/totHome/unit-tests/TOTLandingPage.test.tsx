import { WebPartContext } from '@microsoft/sp-webpart-base';
import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { SPWebPartContextMock } from "spfx-ut-library/lib/base/SPWebPartContextMock";
import { JestHelper } from "spfx-ut-library/lib/helpers/JestHelper";
import * as LocaleStrings from 'TotHomeWebPartStrings';
import TOTLandingPage, { ITOTLandingPageProps } from '../components/TOTLandingPage';

jest.mock('@pnp/spfx-controls-react/lib/TreeView', () => 'TreeView');
jest.mock('react-bootstrap/esm/Card', () => 'Card');
jest.mock('react-bootstrap/esm/Col', () => 'Col');
jest.mock('react-bootstrap/esm/Row', () => 'Row');
jest.mock('@pnp/spfx-controls-react/lib/ChartControl', () => 'ChartControl');

JestHelper.registerMocks(jest);

describe('TOT Landing Page Component', () => {
    let wrapper: ReactWrapper<ITOTLandingPageProps, {}>;

    let mockCtx = new SPWebPartContextMock();
    const context = mockCtx as unknown as WebPartContext;
    const siteUrl = context.pageContext.web.absoluteUrl;
    const isTOTEnabled = true;
    const firstName = "FirstName";

    beforeEach(() => {
        wrapper = mount(React.createElement(
            TOTLandingPage, {
            siteUrl: siteUrl,
            context: context,
            isTOTEnabled: isTOTEnabled,
            firstName: firstName
        }
        ));
    });
    afterEach(() => {
        wrapper.unmount();
    });

    test("Check if the component got rendered", () => {
        expect(wrapper.exists()).toBe(true);
    });

    test(`Check if onclick of leaderboard img redirects to Leaderboard Page and 
    onclick of back button redirects back to landing page`, () => {
        const leaderBoardImg = wrapper.find('img').filterWhere((item) => {
            return item.prop('title') === LocaleStrings.TOTLeaderBoardPageTitle;
        });
        leaderBoardImg.simulate('click');
        expect(wrapper.state('leaderBoard')).toEqual(true);
        const backLabel = wrapper.find('.backLabel');
        backLabel.simulate('click');
        expect(wrapper.state('leaderBoard')).toEqual(false);
    });

    test(`Check if onclick of MyDashboard Image redirects to My dashboard Page and 
    onclick of back button redirects back to landing page`, () => {
        const dashBoardImg = wrapper.find('img').filterWhere((item) => {
            return item.prop('title') === LocaleStrings.TOTMyDashboardPageTitle;
        });
        dashBoardImg.simulate('click');
        expect(wrapper.state('dashboard')).toEqual(true);

        const backLabel = wrapper.find('.backLabel');
        backLabel.simulate('click');
        expect(wrapper.state('dashboard')).toEqual(false);
    });

    test('Check if onclick of digitalBadge Image redirects to Digital Badge Page', () => {
        const digitalBadgeImg = wrapper.find('img').filterWhere((item) => {
            return item.prop('title') === LocaleStrings.DigitalMembersToolTip;
        });
        digitalBadgeImg.simulate('click');
        expect(wrapper.state('digitalBadge')).toEqual(true);
    });

    test(`Check if onclick of Manage Tournaments Image redirects to Manage Tournaments Page and 
    onclick of back button redirects back to landing page`, () => {
        wrapper.setState({ isAdmin: true });
        const manageTournamentsImg = wrapper.find('img').filterWhere((item) => {
            return item.prop('title') === LocaleStrings.ManageTournamentsLabel;
        });
        manageTournamentsImg.simulate('click');
        expect(wrapper.state('manageTournament')).toEqual(true);

        const backLabel = wrapper.find('.backLabel');
        backLabel.simulate('click');
        expect(wrapper.state('manageTournament')).toEqual(false);
    });

    test(`Check if onclick of Tournament reports Image redirects to Tournament Reports Page and 
    onclick of back button redirects back to landing page`, () => {
        wrapper.setState({ isAdmin: true });
        const tournamentReportsImg = wrapper.find('img').filterWhere((item) => {
            return item.prop('title') === LocaleStrings.TournamentReportsPageTitle;
        });
        tournamentReportsImg.simulate('click');
        expect(wrapper.state('tournamentReport')).toEqual(true);

        const backLabel = wrapper.find('.backLabel');
        backLabel.simulate('click');
        expect(wrapper.state('tournamentReport')).toEqual(false);
    });


    test("Check if TOT Enabled Message is displayed", () => {
        wrapper.setState({ showSuccess: true });
        const messageContainer = wrapper.find('.messageContainer').find('label');
        expect(messageContainer.text()).toEqual(LocaleStrings.EnableTOTSuccessMessage);
    });

    test('Check if the component matches the snapshot', () => {
        expect(wrapper.html).toMatchSnapshot();
    });
});