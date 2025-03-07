import type { ComplexArrayItems, ValueSegment } from '..';
import { StringEditor } from '..';
import type { ChangeState, GetTokenPickerHandler } from '../editor/base';
import { notEqual } from '../editor/base/utils/helper';
import { ItemMenuButton, renderLabel } from './expandedsimplearray';
import type { IIconProps } from '@fluentui/react';
import { DefaultButton } from '@fluentui/react';
import { guid } from '@microsoft/utils-logic-apps';
import { useIntl } from 'react-intl';

const addItemButtonIconProps: IIconProps = {
  iconName: 'Add',
};

export interface ExpandedComplexArrayProps {
  dimensionalSchema: any[];
  allItems: ComplexArrayItems[];
  canDeleteLastItem: boolean;
  readOnly?: boolean;
  getTokenPicker: GetTokenPickerHandler;
  setItems: (newItems: ComplexArrayItems[]) => void;
}

export const ExpandedComplexArray = ({
  dimensionalSchema,
  allItems,
  canDeleteLastItem,
  readOnly,
  getTokenPicker,
  setItems,
}: ExpandedComplexArrayProps): JSX.Element => {
  const intl = useIntl();

  const addItemButtonLabel = intl.formatMessage({
    defaultMessage: 'Add new item',
    description: 'Label to add item to array editor',
  });

  const deleteItem = (index: number): void => {
    setItems(allItems.filter((_, i) => i !== index));
  };

  const handleArrayElementSaved = (prevVal: ValueSegment[], newState: ChangeState, index: number, innerIndex: number) => {
    if (notEqual(prevVal, newState.value)) {
      const newItems = [...allItems];
      newItems[index].items[innerIndex].value = newState.value;
      setItems(newItems);
    }
  };

  return (
    <div className="msla-array-container msla-array-item-container">
      {allItems.map((item, index) => {
        return (
          <div key={index} className="msla-array-item">
            {item.items.map((complexItems, i) => {
              return (
                <div key={item.key + i}>
                  <div className="msla-array-item-header">
                    {renderLabel(index, dimensionalSchema[i].title, dimensionalSchema[i].isRequired)}
                    {i === 0 ? (
                      <div className="msla-array-item-commands">
                        <ItemMenuButton
                          disabled={!!readOnly}
                          itemKey={index}
                          visible={canDeleteLastItem || allItems.length > 1}
                          onDeleteItem={(index) => deleteItem(index)}
                        />
                      </div>
                    ) : null}
                  </div>
                  <StringEditor
                    className="msla-array-editor-container-expanded"
                    initialValue={complexItems.value ?? []}
                    getTokenPicker={getTokenPicker}
                    editorBlur={(newState) => handleArrayElementSaved(complexItems.value, newState, index, i)}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
      <div className="msla-array-toolbar">
        <DefaultButton
          className="msla-array-add-item-button"
          iconProps={addItemButtonIconProps}
          text={addItemButtonLabel}
          onClick={() =>
            setItems([
              ...allItems,
              {
                key: guid(),
                items: dimensionalSchema.map((item) => {
                  return { title: item.title, value: [] };
                }),
              },
            ])
          }
        />
      </div>
    </div>
  );
};
