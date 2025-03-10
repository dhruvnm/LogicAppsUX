import { EmptyContent } from '../card/emptycontent';
import type { MenuItemOption } from '../card/types';
import type { PageActionTelemetryData } from '../telemetry/models';
import type { CommonPanelProps, PanelTab } from './panelUtil';
import { PanelScope, PanelLocation } from './panelUtil';
import { PanelContent } from './panelcontent';
import type { PanelHeaderControlType } from './panelheader/panelheader';
import { PanelHeader } from './panelheader/panelheader';
import { PanelPivot } from './panelpivot';
import type { ILayerProps } from '@fluentui/react';
import { MessageBar, MessageBarType, Spinner, SpinnerSize } from '@fluentui/react';
import type { IPanelHeaderRenderer, IPanelProps, IPanelStyles, PanelBase } from '@fluentui/react/lib/Panel';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';

const panelStyles: Partial<IPanelStyles> = {
  content: { padding: '1rem 2rem' },
  main: { overflow: 'hidden' },
  scrollableContent: { height: '100%' },
};

const panelStylesCollapsed: Partial<IPanelStyles> = {
  content: { padding: 0 },
  main: { overflow: 'hidden' },
  scrollableContent: { height: '100%' },
};

export type PanelContainerProps = {
  cardIcon?: string;
  comment?: string;
  noNodeSelected: boolean;
  isError?: boolean;
  isLoading?: boolean;
  panelScope: PanelScope;
  pivotDisabled?: boolean;
  panelHeaderControlType?: PanelHeaderControlType;
  panelHeaderMenu: MenuItemOption[];
  selectedTab?: string;
  showCommentBox: boolean;
  readOnlyMode?: boolean;
  tabs: Record<string, PanelTab>;
  nodeId: string;
  title?: string;
  layerProps?: ILayerProps;
  onDismissButtonClicked?(): void;
  trackEvent(data: PageActionTelemetryData): void;
  setSelectedTab: (tabName: string | undefined) => void;
  toggleCollapse: () => void;
  onCommentChange: (panelCommentChangeEvent?: string) => void;
  renderHeader?: (props?: IPanelProps, defaultrender?: IPanelHeaderRenderer, headerTextId?: string) => JSX.Element;
  onTitleChange: (newValue: string) => void;
  onBlur?: React.FocusEventHandler<PanelBase> | undefined;
} & CommonPanelProps;

export const PanelContainer = ({
  cardIcon,
  comment,
  isCollapsed,
  panelLocation,
  noNodeSelected,
  isError,
  isLoading,
  panelScope,
  panelHeaderControlType,
  panelHeaderMenu,
  selectedTab,
  showCommentBox,
  readOnlyMode,
  tabs,
  nodeId,
  title,
  width,
  layerProps,
  onDismissButtonClicked,
  setSelectedTab,
  toggleCollapse,
  trackEvent,
  renderHeader,
  onCommentChange,
  onTitleChange,
  onBlur,
}: PanelContainerProps) => {
  const intl = useIntl();
  const onTabChange = (itemKey: string): void => {
    setSelectedTab && setSelectedTab(itemKey);
  };

  const defaultRenderHeader = useCallback(
    (_props?: IPanelProps, _defaultrender?: IPanelHeaderRenderer, headerTextId?: string): JSX.Element => {
      return (
        <PanelHeader
          nodeId={nodeId}
          cardIcon={cardIcon}
          isCollapsed={isCollapsed}
          headerLocation={panelLocation}
          showCommentBox={showCommentBox}
          noNodeSelected={noNodeSelected}
          panelScope={panelScope}
          onDismissButtonClicked={onDismissButtonClicked}
          panelHeaderMenu={panelHeaderMenu}
          panelHeaderControlType={panelHeaderControlType}
          readOnlyMode={readOnlyMode}
          titleId={headerTextId}
          title={title}
          includeTitle={true}
          isError={isError}
          isLoading={isLoading}
          comment={comment}
          commentChange={onCommentChange}
          toggleCollapse={toggleCollapse}
          onTitleChange={onTitleChange}
        />
      );
    },
    [
      nodeId,
      cardIcon,
      isCollapsed,
      panelLocation,
      showCommentBox,
      noNodeSelected,
      panelScope,
      onDismissButtonClicked,
      panelHeaderMenu,
      panelHeaderControlType,
      readOnlyMode,
      title,
      isError,
      isLoading,
      comment,
      onCommentChange,
      toggleCollapse,
      onTitleChange,
    ]
  );

  const panelLabel = intl.formatMessage({
    defaultMessage: 'panel',
    description: 'label for panel component',
  });

  const panelErrorMessage = intl.formatMessage({
    defaultMessage: 'Error loading operation data',
    description: 'label for panel error',
  });

  return (
    <Panel
      aria-label={panelLabel}
      className="msla-panel-container"
      headerClassName="msla-panel-header"
      headerText={title || panelLabel}
      isOpen
      onRenderHeader={renderHeader ?? defaultRenderHeader}
      focusTrapZoneProps={{ disabled: isCollapsed }}
      isBlocking={false}
      hasCloseButton={false}
      type={panelLocation === PanelLocation.Right ? PanelType.custom : PanelType.customNear}
      customWidth={width}
      styles={isCollapsed ? panelStylesCollapsed : panelStyles}
      layerProps={layerProps}
      onBlur={onBlur}
    >
      {!isCollapsed && (
        <>
          {noNodeSelected && panelScope === PanelScope.CardLevel ? (
            <EmptyContent />
          ) : isLoading ? (
            <div className="msla-loading-container">
              <Spinner size={SpinnerSize.large} />
            </div>
          ) : isError ? (
            <MessageBar messageBarType={MessageBarType.error}>{panelErrorMessage}</MessageBar>
          ) : (
            <div className="msla-panel-page">
              <PanelPivot
                isCollapsed={isCollapsed}
                tabs={tabs}
                selectedTab={selectedTab}
                onTabChange={onTabChange}
                trackEvent={trackEvent}
                nodeId={nodeId}
              />
              <PanelContent tabs={tabs} selectedTab={selectedTab} />
            </div>
          )}
        </>
      )}
    </Panel>
  );
};
