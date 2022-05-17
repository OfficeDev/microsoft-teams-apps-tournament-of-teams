import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'TotHomeWebPartStrings';
import TotHome from './components/TotHome';
import { ITotHomeProps } from './components/ITotHomeProps';

export interface ITotHomeWebPartProps {
  description: string;
}

export default class TotHomeWebPart extends BaseClientSideWebPart<ITotHomeWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ITotHomeProps> = React.createElement(
      TotHome,
      {
        description: this.properties.description,
        context: this.context,
        // passing siteUrl here for mutlti tenant.
        siteUrl: this.context.pageContext.web.absoluteUrl.replace(this.context.pageContext.web.serverRelativeUrl, ""),
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
