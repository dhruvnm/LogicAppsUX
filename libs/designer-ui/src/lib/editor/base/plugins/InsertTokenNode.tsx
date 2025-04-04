import type { TokenNodeProps } from '../nodes/tokenNode';
import { $createTokenNode, TokenNode } from '../nodes/tokenNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { LexicalCommand } from 'lexical';
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical';
import { useEffect } from 'react';

export const INSERT_TOKEN_NODE: LexicalCommand<TokenNodeProps> = createCommand();

export default function InsertTokenNode(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([TokenNode])) {
      throw new Error('InsertTokenNodePlugin: TokenNode not registered on editor');
    }

    return editor.registerCommand<TokenNodeProps>(
      INSERT_TOKEN_NODE,
      (payload: TokenNodeProps) => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) && payload.data.token) {
          const { remappedValue, value } = payload.data.token;
          const tokenNode = $createTokenNode({ ...payload, value: remappedValue ?? value });
          selection.insertNodes([tokenNode]);
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
