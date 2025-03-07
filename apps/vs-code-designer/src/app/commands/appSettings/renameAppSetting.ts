/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ext } from '../../../extensionVariables';
import { AppSettingTreeItem } from '@microsoft/vscode-azext-azureappservice';
import type { IActionContext } from '@microsoft/vscode-azext-utils';

export async function renameAppSetting(context: IActionContext, node?: AppSettingTreeItem): Promise<void> {
  if (!node) {
    node = await ext.tree.showTreeItemPicker<AppSettingTreeItem>(AppSettingTreeItem.contextValue, context);
  }

  await node.rename(context);
}
