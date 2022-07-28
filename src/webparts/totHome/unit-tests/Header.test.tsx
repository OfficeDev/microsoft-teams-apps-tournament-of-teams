import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { JestHelper } from "spfx-ut-library/lib/helpers/JestHelper";
import { default as Header, default as IHeaderProps } from "../components/Header";

JestHelper.registerMocks(jest);

describe('Header Component', () => {
    let wrapper: ReactWrapper<IHeaderProps, {}>;
    const clickCallBackMock = jest.fn();

    beforeEach(() => {
        wrapper = mount(React.createElement(
            Header, {
            clickcallback: clickCallBackMock
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
        expect(clickCallBackMock.mock.calls.length).toEqual(1);
    });

    test("Check if onclick of info icon opens the callout in header bar", () => {
        const infoIcon = wrapper.find('#callout-button').at(0);
        infoIcon.simulate('click');
        expect(wrapper.state('isCalloutVisible')).toEqual(true);
    });

    test('Check if the component matches the snapshot', () => {
        expect(wrapper.html).toMatchSnapshot();
    });

});