import { WebPartContext } from '@microsoft/sp-webpart-base';
import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { SPWebPartContextMock } from "spfx-ut-library/lib/base/SPWebPartContextMock";
import { JestHelper } from "spfx-ut-library/lib/helpers/JestHelper";
import * as LocaleStrings from 'TotHomeWebPartStrings';
import TOTEnableTournament, { IEnableTournamentProps } from "../components/TOTEnableTournament";

JestHelper.registerMocks(jest);

describe('TOT Enable Tournament Component', () => {
    let wrapper: ReactWrapper<IEnableTournamentProps, {}>;

    let mockCtx = new SPWebPartContextMock();
    const context = mockCtx as unknown as WebPartContext;
    const siteUrl: string = context.pageContext.web.absoluteUrl;
    const onClickCancel: Function = jest.fn();

    beforeEach(() => {
        wrapper = mount(React.createElement(
            TOTEnableTournament, {
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

    // test("Check if onclick of start tournament button opens up confirm dialog box and onclick of cancel icon or no button closes the popup", () => {
    //     const tournamentsList = [{
    //         key: "key1",
    //         text: "text1"
    //     }, {
    //         key: "key2",
    //         text: "text2"
    //     }, {
    //         key: "key3",
    //         text: "text3"
    //     }];
    //     wrapper.setState({ tournamentsList: tournamentsList });
    //     const choice = wrapper.find('#tournamentList').find('input').filterWhere((item) => {
    //         return item.prop("type") === "radio";
    //     });
    //     choice.at(1).simulate('change', { target: { checked: true } });
    //     const startBtn = wrapper.find('button').filterWhere((item) => {
    //         return item.prop('title') === LocaleStrings.StartTournamentButton;
    //     });
    //     startBtn.simulate('click');
    //     expect(wrapper.state('hideDialog')).toEqual(false);
    //     const cancelIcon = wrapper.find('i').filterWhere((item) => {
    //         return item.prop('data-icon-name') === "Cancel";
    //     });
    //     cancelIcon.simulate('click');
    //     expect(wrapper.state('hideDialog')).toEqual(true);

    //     startBtn.simulate('click');
    //     const noBtn = wrapper.find('button').filterWhere((item) => {
    //         return item.prop('title') === LocaleStrings.NoButton;
    //     });
    //     noBtn.simulate('click');
    //     expect(wrapper.state('hideDialog')).toEqual(true);
    // });

    test("Check if onclick of back button calls the prop method onClickCancel", () => {
        const backBtn = wrapper.find('button').filterWhere((item) => {
            return item.prop('title') === LocaleStrings.BackButton;
        });
        backBtn.simulate('click');
        expect(onClickCancel).toHaveBeenCalled();
    });

    // test("Check if onselection of tournament and onclick of start & confirm tournament buttons makes the active tournament flag true", () => {
    //     const tournamentsList = [{
    //         key: "key1",
    //         text: "text1"
    //     }, {
    //         key: "key2",
    //         text: "text2"
    //     }, {
    //         key: "key3",
    //         text: "text3"
    //     }];
    //     wrapper.setState({ tournamentsList: tournamentsList });
    //     const choice = wrapper.find('#tournamentList').find('input').filterWhere((item) => {
    //         return item.prop("type") === "radio";
    //     });
    //     choice.at(2).simulate('change', { target: { checked: true } });
    //     const startBtn = wrapper.find('button').filterWhere((item) => {
    //         return item.prop('title') === LocaleStrings.StartTournamentButton;
    //     });
    //     startBtn.simulate('click');
    //     const yesBtn = wrapper.find('button').filterWhere((item) => {
    //         return item.prop('title') === LocaleStrings.YesButton;
    //     });
    //     yesBtn.simulate('click');
    //     expect(wrapper.state('activeTournamentFlag')).toEqual(true);
    // });

    // test("Check if onselection of active tournament and onclick of complete & confirm tournament buttons displays the loading-spinner", () => {
    //     const activeTournamentsList = [{
    //         key: "key1",
    //         text: "text1"
    //     }, {
    //         key: "key2",
    //         text: "text2"
    //     }, {
    //         key: "key3",
    //         text: "text3"
    //     }];
    //     wrapper.setState({ activeTournamentsList: activeTournamentsList });
    //     const choice = wrapper.find('#activeTournamentsList').find('input').filterWhere((item) => {
    //         return item.prop("type") === "radio";
    //     });
    //     choice.at(0).simulate('change', { target: { checked: true } });
    //     const completeBtn = wrapper.find('button').filterWhere((item) => {
    //         return item.prop('title') === LocaleStrings.EndTournamentButton;
    //     });
    //     completeBtn.simulate('click');
    //     const yesBtn = wrapper.find('button').filterWhere((item) => {
    //         return item.prop('title') === LocaleStrings.YesButton;
    //     });
    //     yesBtn.simulate('click');
    //     expect(wrapper.state('showSpinner')).toEqual(true);
    // });

    test("Check if without selection of active tournament and onclick of end tournament button makes the state endTournamentError to true", () => {
        const activeTournamentsList = [{
            key: "key1",
            text: "text1"
        }, {
            key: "key2",
            text: "text2"
        }, {
            key: "key3",
            text: "text3"
        }];
        wrapper.setState({ activeTournamentsList: activeTournamentsList });
        const completeBtn = wrapper.find('button').filterWhere((item) => {
            return item.prop('title') === LocaleStrings.EndTournamentButton;
        });
        completeBtn.simulate('click');
        expect(wrapper.state('endTournamentError')).toEqual(true);
    });

    test("Check if without selection of tournament and onclick of start tournament button makes the state startTournamentError to true", () => {
        const tournamentsList = [{
            key: "key1",
            text: "text1"
        }, {
            key: "key2",
            text: "text2"
        }, {
            key: "key3",
            text: "text3"
        }];
        wrapper.setState({ tournamentsList: tournamentsList });
        const startBtn = wrapper.find('button').filterWhere((item) => {
            return item.prop('title') === LocaleStrings.StartTournamentButton;
        });
        startBtn.simulate('click');
        expect(wrapper.state('startTournamentError')).toEqual(true);
    });

    test('Check if the component matches the snapshot.', () => {
        expect(wrapper.html).toMatchSnapshot();
    });

});

