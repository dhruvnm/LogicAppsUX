/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ext } from '../../extensionVariables';
import type { AzExtParentTreeItem, IActionContext } from '@microsoft/vscode-azext-utils';

export async function createChildNode(
  context: IActionContext,
  expectedContextValue: string | RegExp,
  node?: AzExtParentTreeItem
): Promise<void> {
  if (!node) {
    node = await ext.tree.showTreeItemPicker<AzExtParentTreeItem>(expectedContextValue, context);
  }

  await node.createChild(context);
}
