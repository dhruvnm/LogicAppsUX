import constants from '../constants';
import type { Token } from '../editor';
import { ValueSegmentType, TokenType } from '../editor';
import { INSERT_TOKEN_NODE } from '../editor/base/plugins/InsertTokenNode';
import { SINGLE_VALUE_SEGMENT } from '../editor/base/plugins/SingleValueSegment';
import type { ExpressionEditorEvent } from '../expressioneditor';
import { UPDATE_TOKEN_NODE } from './plugins/UpdateTokenNode';
import { getExpressionTokenTitle } from './util';
import { PrimaryButton } from '@fluentui/react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { Expression } from '@microsoft/parsers-logic-apps';
import { ExpressionParser } from '@microsoft/parsers-logic-apps';
import { guid } from '@microsoft/utils-logic-apps';
import type { LexicalEditor, NodeKey } from 'lexical';
import { useIntl } from 'react-intl';

const FxIcon =
  'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzNCAzNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiA8cmVjdCB3aWR0aD0iMzQiIGhlaWdodD0iMzQiIGZpbGw9IiNhZDAwOGMiLz4NCiA8cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNMTMuNDg3LDEzLjI0OGE3LjA1NCw3LjA1NCwwLDAsMSwxLjg0OS0zLjY5QTUuMyw1LjMsMCwwLDEsMTguNTkzLDcuOWMuOTg1LDAsMS40NjcuNTg1LDEuNDQ3LDEuMDY5YTEuNTUxLDEuNTUxLDAsMCwxLS43NDQsMS4xNDkuNDA2LjQwNiwwLDAsMS0uNTQzLS4wNjFjLS41NDMtLjY2NS0xLjAwNS0xLjA2OS0xLjM2Ny0xLjA2OS0uNC0uMDItLjc2NC4yODItMS40MDcsNC4yNTVoMi4zMzJsLS40MjIuODA3LTIuMDkuMTYxYy0uMzQyLDEuODM1LS42LDMuNjMtMS4xNDYsNS45MDgtLjc4NCwzLjMyNy0xLjY4OCw0LjY1OC0zLjEsNS44MjdBMy43NDYsMy43NDYsMCwwLDEsOS4zNDcsMjdDOC42ODMsMjcsOCwyNi41NTYsOCwyNi4wMzJhMS42OTIsMS42OTIsMCwwLDEsLjcyNC0xLjE0OWMuMTYxLS4xMjEuMjgxLS4xNDEuNDIyLS4wNGEyLjg3MywyLjg3MywwLDAsMCwxLjU2OC43MDYuNjc1LjY3NSwwLDAsMCwuNjYzLS41LDI3LjQyNywyNy40MjcsMCwwLDAsLjg0NC00LjE3NGMuNDYyLTIuNzYyLjc0NC00LjY1OCwxLjA4NS02LjY1NEgxMS43bC0uMS0uMi42ODMtLjc2NloiLz4NCiA8cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNMTcuMzIxLDE4LjljLjgxMi0xLjE4MywxLjY1NC0xLjg3NCwyLjIzNi0xLjg3NC40OSwwLC43MzUuNTIyLDEuMDU3LDEuNDlsLjIzLjcyMmMxLjE2NC0xLjY3NSwxLjczMS0yLjIxMiwyLjQtMi4yMTJhLjc0Mi43NDIsMCwwLDEsLjc1MS44NDUuOTIyLjkyMiwwLDAsMS0uOC44NzYuNDE0LjQxNCwwLDAsMS0uMjkxLS4xNjkuNDc3LjQ3NywwLDAsMC0uMzY4LS4xODRjLS4xNTMsMC0uMzM3LjEwOC0uNjEzLjM4NGE4LjU0Nyw4LjU0NywwLDAsMC0uODczLDEuMDc1bC42MTMsMS45NjZjLjE4NC42My4zNjcuOTUyLjU2Ny45NTIuMTg0LDAsLjUwNi0uMjQ2LDEuMDQyLS44OTFsLjMyMi4zODRjLS45LDEuNDI5LTEuNzYxLDEuOTItMi4zNDMsMS45Mi0uNTIxLDAtLjg1OC0uNDMtMS4xOC0xLjQ5bC0uMzUyLTEuMTY4Yy0xLjE3OSwxLjkyLTEuNzQ2LDIuNjU4LTIuNTQzLDIuNjU4YS44MTUuODE1LDAsMCwxLS44MTItLjg3NS45LjksMCwwLDEsLjc2Ni0uOTIyLjQ5My40OTMsMCwwLDEsLjI5MS4xNTQuNTE0LjUxNCwwLDAsMCwuMzY4LjE2OWMuMzM3LDAsLjk1LS42NzYsMS43MTUtMS44NTlsLS40LTEuMzY3Yy0uMjc2LS45MDYtLjQxNC0xLjAxNC0uNTY3LTEuMDE0LS4xMzgsMC0uNDE0LjItLjg4OC44MTRaIi8+DQo8L3N2Zz4NCg==';

interface TokenPickerFooterProps {
  expression: ExpressionEditorEvent;
  expressionToBeUpdated: NodeKey | null;
  setExpressionEditorError: (error: string) => void;
}

export function TokenPickerFooter({ expression, expressionToBeUpdated, setExpressionEditorError }: TokenPickerFooterProps) {
  let editor: LexicalEditor | null;
  try {
    [editor] = useLexicalComposerContext();
  } catch {
    editor = null;
  }
  const intl = useIntl();

  const tokenPickerAdd = intl.formatMessage({
    defaultMessage: 'Add',
    description: 'Insert Expression',
  });
  const tokenPickerUpdate = intl.formatMessage({
    defaultMessage: 'Update',
    description: 'Update Expression',
  });
  const invalidExpression = intl.formatMessage({
    defaultMessage: 'The expression is invalid.',
    description: 'invalid expression alert',
  });

  const onUpdateOrAddClicked = () => {
    let currExpression: Expression | null = null;
    try {
      currExpression = ExpressionParser.parseExpression(expression.value);
    } catch (ex) {
      setExpressionEditorError(invalidExpression);
      return;
    }
    const token: Token = {
      tokenType: TokenType.FX,
      expression: currExpression,
      brandColor: constants.FX_COLOR,
      icon: FxIcon,
      title: getExpressionTokenTitle(currExpression),
      // Todo: get Expression Token description
      description: '',
      key: guid(),
      value: expression.value,
    };
    if (expressionToBeUpdated) {
      editor?.dispatchCommand(UPDATE_TOKEN_NODE, {
        updatedValue: expression.value,
        updatedTitle: token.title,
        updatedData: {
          id: guid(),
          type: ValueSegmentType.TOKEN,
          value: expression.value,
          token,
        },
        nodeKey: expressionToBeUpdated,
      });
    } else {
      editor?.dispatchCommand(SINGLE_VALUE_SEGMENT, true);
      editor?.dispatchCommand(INSERT_TOKEN_NODE, {
        brandColor: token.brandColor,
        description: token.description,
        title: token.title,
        icon: token.icon ?? FxIcon,
        value: token.value,
        data: {
          id: guid(),
          type: ValueSegmentType.TOKEN,
          value: expression.value,
          token,
        },
      });
    }
  };

  return (
    <div className="msla-token-picker-footer">
      <PrimaryButton
        text={expressionToBeUpdated ? tokenPickerUpdate : tokenPickerAdd}
        onClick={onUpdateOrAddClicked}
        style={{ marginLeft: '10px', height: '28px', fontSize: '14px' }}
      />
    </div>
  );
}
