import { WebPartContext } from '@microsoft/sp-webpart-base';
import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { SPWebPartContextMock } from "spfx-ut-library/lib/base/SPWebPartContextMock";
import { JestHelper } from "spfx-ut-library/lib/helpers/JestHelper";
import * as LocaleStrings from 'TotHomeWebPartStrings';
import TOTReport, { ITOTReportProps } from "../components/TOTReport";

jest.mock('react-bootstrap/esm/Card', () => 'Card');
jest.mock('react-bootstrap/esm/Col', () => 'Col');
jest.mock('react-bootstrap/esm/Row', () => 'Row');
jest.mock('@pnp/spfx-controls-react/lib/ChartControl', () => 'ChartControl');
// jest.mock('@pnp/spfx-controls-react/lib/ChartControl', () => ({
//     'ChartType': () => ({ 'HorizontalBar': () => 'horizontalBar', 'Doughnut': () => 'doughnut' })
// }));


JestHelper.registerMocks(jest);

describe('TOT Report Component', () => {
    let wrapper: ReactWrapper<ITOTReportProps, {}>;

    let mockCtx = new SPWebPartContextMock();
    const context = mockCtx as unknown as WebPartContext;
    const siteUrl: string = context.pageContext.web.absoluteUrl;
    const onClickCancel = jest.fn();

    beforeEach(() => {
        wrapper = mount(React.createElement(
            TOTReport, {
            siteUrl: siteUrl,
            context: context,
            onClickCancel: onClickCancel
        }
        ));
    });

    afterEach(() => {
        wrapper.unmount();
    });

    test("Check if the component got rendered", () => {
        expect(wrapper.exists()).toBe(true);
    });

    test("", () => {
        const participantsList = [{
            name: "Name1",
            activitiesCompleted: 2,
            points: 350,
            tournamentCompletedPercentage: 66
        }, {
            name: "Name2",
            activitiesCompleted: 4,
            points: 250,
            tournamentCompletedPercentage: 87
        }, {
            name: "Name3",
            activitiesCompleted: 3,
            points: 150,
            tournamentCompletedPercentage: 40
        }];
        wrapper.setState({ participantsList: participantsList, csvFileName: "CsvFileName" });
        const progressBar = wrapper.find('progress').at(0);
        expect(progressBar.prop("value")).toEqual(66);
    });

    // test("", () => {
    //     const tournamentsList = [{
    //         key: "tournament1",
    //         text: "Tournament1"
    //     }, {
    //         key: "tournament2",
    //         text: "Tournament2"
    //     }, {
    //         key: "tournament3",
    //         text: "Tournament3"
    //     }]
    //     wrapper.setState({ tournamentsList: tournamentsList });
    //     const dropdownArea = wrapper.find('.totReportDropdown').find('button');
    //     dropdownArea.simulate('click');
    //     const callout = wrapper.find('.totReportComboBoxCallout').find('span').filterWhere((item) => {
    //         return item.text() === "Tournament2"
    //     });
    //     callout.at(2).simulate('click');
    //     expect(wrapper.state('selectedTournament')).toEqual('tournament2');

    // });

});