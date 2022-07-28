import { WebPartContext } from '@microsoft/sp-webpart-base';
import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { SPWebPartContextMock } from "spfx-ut-library/lib/base/SPWebPartContextMock";
import { JestHelper } from "spfx-ut-library/lib/helpers/JestHelper";
import { ITotHomeProps } from '../components/ITotHomeProps';
import TotHome from '../components/TotHome';

JestHelper.registerMocks(jest);

jest.mock('@pnp/spfx-controls-react/lib/TreeView', () => 'TreeView');
jest.mock('react-bootstrap/esm/Card', () => 'Card');
jest.mock('react-bootstrap/esm/Col', () => 'Col');
jest.mock('react-bootstrap/esm/Row', () => 'Row');
jest.mock('@pnp/spfx-controls-react/lib/ChartControl', () => 'ChartControl');


describe('TOT Home Component', () => {
    let wrapper: ReactWrapper<ITotHomeProps, {}>;

    let mockCtx = new SPWebPartContextMock();
    const context = mockCtx as unknown as WebPartContext;
    const siteUrl = "https://siteUrl.com";
    const description = "this is a description";

    beforeEach(() => {
        wrapper = mount(React.createElement(
            TotHome, {
            siteUrl: siteUrl,
            context: context,
            description: description
        }
        ));
    });
    afterEach(() => {
        wrapper.unmount();
    });

    test("Check if the component got rendered", () => {
        expect(wrapper.exists()).toBe(true);
    });

    test("Check if onclick of Home Logo calls the home call back function", () => {
        const homeLogo = wrapper.find('.clbHeaderLogo');
        homeLogo.simulate('click');
        expect(wrapper.state('enableTOT')).toEqual(false);
    });

    test("Check if onclick enableTot Image enables the Tournament of Teams", async () => {
        wrapper.setState({
            enableTOT: true,
            showSuccess: false
        });
        const enableTOTLabel = wrapper.find('.enableTournamentLabel');
        enableTOTLabel.simulate('click');
        expect(wrapper.state('enableTOT')).toEqual(false);
    });

    test('Check if the component matches the snapshot', () => {
        expect(wrapper.html).toMatchSnapshot();
    });
});