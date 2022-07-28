import { WebPartContext } from '@microsoft/sp-webpart-base';
import { mount, ReactWrapper } from 'enzyme';
import { escapeSelector } from 'jquery';
import React from 'react';
import { SPWebPartContextMock } from "spfx-ut-library/lib/base/SPWebPartContextMock";
import { JestHelper } from "spfx-ut-library/lib/helpers/JestHelper";
import * as LocaleStrings from 'TotHomeWebPartStrings';
import TOTCreateTournament, { ICreateTournamentProps } from "../components/TOTCreateTournament";
import XLSX from 'xlsx';


JestHelper.registerMocks(jest);
jest.mock('@pnp/spfx-controls-react/lib/TreeView', () => 'TreeView');

describe('TOT Create Tournament Component', () => {
    let wrapper: ReactWrapper<ICreateTournamentProps, {}>;

    let mockCtx = new SPWebPartContextMock();
    const context = mockCtx as unknown as WebPartContext;
    const siteUrl: string = context.pageContext.web.absoluteUrl;
    const onClickCancel: Function = jest.fn();


    beforeEach(() => {
        wrapper = mount(React.createElement(
            TOTCreateTournament, {
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

    test("Check if onclick of back button calls the prop method onClickCancel", () => {
        const backBtn = wrapper.find('button').filterWhere((item) => {
            return item.prop('title') === LocaleStrings.BackButton;
        });
        backBtn.simulate('click');
        expect(onClickCancel).toHaveBeenCalled();
    });
    test("Check if onclick of back Label calls the prop method onClickCancel", () => {
        const backLabel = wrapper.find('.backLabel');
        backLabel.simulate('click');
        expect(backLabel.text()).toBe("Tournament of Teams");
        expect(onClickCancel).toHaveBeenCalled();
    });

    test("Validate Tournament Name Text field", () => {
        const tournamentName = wrapper.find('input').filterWhere((item) => {
            return item.prop("placeholder") === LocaleStrings.TournamentNamePlaceHolderLabel;
        });
      
        expect(tournamentName.exists()).toBe(true);
        expect(tournamentName.prop('maxLength')).toEqual(255);
        //Update Tournament Name field with sample text
        tournamentName.simulate('change', { target: { value: 'Tournament 1' } });
        expect(wrapper.state('tournamentName')).toEqual('Tournament 1');
        expect(wrapper.find('input').at(0).prop('value')).toEqual('Tournament 1');

    });

    test("Validate Tournament Description Text Field", () => {
        const tournamentDesc = wrapper.find('textarea').filterWhere((item) => {
            return item.prop("placeholder") === LocaleStrings.TournamentDescPlaceHolderLabel;
        });

        expect(tournamentDesc.exists()).toBe(true);
        expect(tournamentDesc.prop('maxLength')).toEqual(500);
        //Update Tournament Description field with sample text
        tournamentDesc.simulate('change', { target: { value: 'Tournament 1 description' } });
        expect(wrapper.state('tournamentDescription')).toEqual('Tournament 1 description');
        expect(wrapper.find('textarea').at(0).prop('value')).toEqual('Tournament 1 description');

    });

    test("Check if on click of Tournament type renders the appropriate tournament screen", () => {
        //Multiple Tournaments
        const multiTournament = wrapper.find('.multipleTrmntType');
        multiTournament.simulate('click');
        expect(wrapper.state('multipleTournament')).toEqual(true);
        expect(wrapper.state('singleTournament')).toEqual(false);
        //Single Tournaments
        const singleTournament = wrapper.find('.singleTrmntType');
        singleTournament.simulate('click');
        expect(wrapper.state('multipleTournament')).toEqual(false);
        expect(wrapper.state('singleTournament')).toEqual(true);
    });

    test("Check if file input field is available in multi tournament screen", async () => {
        //Multiple Tournaments
        const multiTournament = wrapper.find('.multipleTrmntType');
        multiTournament.simulate('click');
        const fileInput = wrapper.find('.multipleTrmntsFileInput').find('input').filterWhere((item) => {
            return item.prop("type") === "file";
        });
        expect(fileInput.exists()).toBe(true);

        const file = new File(["sample tournament"], "template.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        fileInput.simulate('change', { target: { files: [file] } });
        expect(wrapper.state('multipleTrnmtFileName')).toContain("template.xlsx");
        //Check File Name
        const fileName = wrapper.find('.multipleTrmntsFileName');
        expect(fileName.prop('title')).toContain("template.xlsx");

        //Check Progress Bar
        expect(wrapper.find('.percentage').exists()).toBe(true);

        //Check Cancel Button
        const cancelIcon = wrapper.find('.cancelIconArea').find('i');
        cancelIcon.simulate('click');
        expect(wrapper.state('multipleTrnmtFileName')).toEqual("");

    });

    test("Validate Create tournaments button in multi tournament screen", async () => {
        
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet([
            ["TournamentName", "Description", "Category","Action","ActionDescription","Points","HelpURL"],
            ["Sample Tournament 1", "Tournament focuses on Microsoft Teams communication capabilities. ", "Chat","Send1:1","Send a 1:1 chat to someone else in the organization","10",null],
            [null,null,"Chat", "Send GIF", "Send a GIF to someone else in org","20",null]
          ]);
          XLSX.utils.book_append_sheet(workbook, worksheet, "Tournament1");

          wrapper.setState({
            totalSheets: ['Tournament1'],
            workBook: workbook,
            disableCreateTournaments:false
        });
        //Multiple Tournaments
        const multiTournament = wrapper.find('.multipleTrmntType');
        multiTournament.simulate('click');
        const CreateTournaments = wrapper.find('button').filterWhere((item) => {
            return item.prop('title') === LocaleStrings.CreateTournamentsButton;
        });
        CreateTournaments.simulate('click');
        expect(CreateTournaments.exists()).toBe(true);   
        expect(wrapper.state('disableForm')).toBe(true);
    });

    test("Validate Create tournament button in single tournament screen", async () => {

          wrapper.setState({
            tournamentName: "Sample"
        });       
        const CreateTournament = wrapper.find('button').filterWhere((item) => {
            return item.prop('title') === LocaleStrings.CreateTournamentButton;
        });
        CreateTournament.simulate('click');
        expect(CreateTournament.exists()).toBe(true);   
        expect(wrapper.state('actionsError')).toBe(true);
    });

    test('Check if the component matches the snapshot.', () => {
        expect(wrapper.html).toMatchSnapshot();
    });

});