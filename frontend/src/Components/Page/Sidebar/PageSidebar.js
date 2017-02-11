import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { icons } from 'Helpers/Props';
import locationShape from 'Helpers/Props/Shapes/locationShape';
import dimensions from 'Styles/Variables/dimensions';
import OverlayScroller from 'Components/Scroller/OverlayScroller';
import Scroller from 'Components/Scroller/Scroller';
import QueueStatusConnector from 'Activity/Queue/Status/QueueStatusConnector';
import HealthStatusConnector from 'System/Status/Health/HealthStatusConnector';
import MessagesConnector from './Messages/MessagesConnector';
import PageSidebarItem from './PageSidebarItem';
import styles from './PageSidebar.css';

const HEADER_HEIGHT = parseInt(dimensions.headerHeight);
const SIDEBAR_WIDTH = parseInt(dimensions.sidebarWidth);

const links = [
  {
    iconName: icons.SERIES_CONTINUING,
    title: 'Series',
    to: '/',
    alias: '/series',
    children: [
      {
        title: 'Add New',
        to: '/add/new'
      },
      {
        title: 'Import',
        to: '/add/import'
      },
      {
        title: 'Editor',
        to: '/serieseditor'
      },
      {
        title: 'Season Pass',
        to: '/seasonpass'
      }
    ]
  },

  {
    iconName: icons.CALENDAR,
    title: 'Calendar',
    to: '/calendar'
  },

  {
    iconName: icons.ACTIVITY,
    title: 'Activity',
    to: '/activity/queue',
    children: [
      {
        title: 'Queue',
        to: '/activity/queue',
        statusComponent: QueueStatusConnector
      },
      {
        title: 'History',
        to: '/activity/history'
      },
      {
        title: 'Blacklist',
        to: '/activity/blacklist'
      }
    ]
  },

  {
    iconName: icons.WARNING,
    title: 'Wanted',
    to: '/wanted/missing',
    children: [
      {
        title: 'Missing',
        to: '/wanted/missing'
      },
      {
        title: 'Cutoff Unmet',
        to: '/wanted/cutoffunmet'
      }
    ]
  },

  {
    iconName: icons.SETTINGS,
    title: 'Settings',
    to: '/settings/ui',
    children: [
      {
        title: 'UI',
        to: '/settings/ui'
      },
      {
        title: 'Media Management',
        to: '/settings/mediamanagement'
      },
      {
        title: 'Profiles',
        to: '/settings/profiles'
      },
      {
        title: 'Quality',
        to: '/settings/quality'
      },
      {
        title: 'Indexers',
        to: '/settings/indexers'
      },
      {
        title: 'Download Clients',
        to: '/settings/downloadclients'
      },
      {
        title: 'Connect',
        to: '/settings/connect'
      },
      {
        title: 'Metadata',
        to: '/settings/metadata'
      },
      {
        title: 'General',
        to: '/settings/general'
      }
    ]
  },

  {
    iconName: icons.SYSTEM,
    title: 'System',
    to: '/system/status',
    children: [
      {
        title: 'Status',
        to: '/system/status',
        statusComponent: HealthStatusConnector
      },
      {
        title: 'Tasks',
        to: '/system/tasks'
      },
      {
        title: 'Backup',
        to: '/system/backup'
      },
      {
        title: 'Updates',
        to: '/system/updates'
      },
      {
        title: 'Events',
        to: '/system/events'
      },
      {
        title: 'Log Files',
        to: '/system/logs/files'
      }
    ]
  }
];

function getActiveParent(pathname) {
  let activeParent = links[0].to;

  links.forEach((link) => {
    if (link.to && link.to === pathname) {
      activeParent = link.to;

      return false;
    }

    const children = link.children;

    if (children) {
      children.forEach((childLink) => {
        if (pathname.startsWith(childLink.to)) {
          activeParent = link.to;

          return false;
        }
      });
    }

    if (
      (link.to !== '/' && pathname.startsWith(link.to)) ||
      (link.alias && pathname.startsWith(link.alias))
    ) {
      activeParent = link.to;

      return false;
    }
  });

  return activeParent;
}

function hasActiveChildLink(link, pathname) {
  const children = link.children;

  if (!children || !children.length) {
    return false;
  }

  return _.some(children, (child) => {
    return child.to === pathname;
  });
}

function getPositioning() {
  const windowScroll = window.scrollY == null ? document.documentElement.scrollTop : window.scrollY;
  const top = Math.max(HEADER_HEIGHT - windowScroll, 0);
  const height = window.innerHeight - top;

  return {
    top: `${top}px`,
    height: `${height}px`
  };
}

class PageSidebar extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this._touchStart = null;
    this._sidebarRef = null;

    this.state = {
      top: dimensions.headerHeight,
      height: `${window.innerHeight - HEADER_HEIGHT}px`,
      transform: props.isSidebarVisible ? 0 : SIDEBAR_WIDTH * -1
    };
  }

  componentDidMount() {
    if (this.props.isSmallScreen) {
      window.addEventListener('click', this.onWindowClick);
      window.addEventListener('scroll', this.onWindowScroll);
      window.addEventListener('touchstart', this.onTouchStart);
      window.addEventListener('touchend', this.onTouchEnd);
      window.addEventListener('touchcancel', this.onTouchCancel);
      window.addEventListener('touchmove', this.onTouchMove);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isSidebarVisible !== this.props.isSidebarVisible) {
      this.setState({
        transform: nextProps.isSidebarVisible ? 0 : SIDEBAR_WIDTH * -1
      });
    }
  }

  componentWillUnmount() {
    if (this.props.isSmallScreen) {
      window.removeEventListener('click', this.onWindowClick);
      window.removeEventListener('scroll', this.onWindowScroll);
      window.removeEventListener('touchstart', this.onTouchStart);
      window.removeEventListener('touchend', this.onTouchEnd);
      window.removeEventListener('touchcancel', this.onTouchCancel);
      window.removeEventListener('touchmove', this.onTouchMove);
    }
  }

  //
  // Control

  _setSidebarRef = (ref) => {
    this._sidebarRef = ref;
  }

  //
  // Listeners

  onWindowClick = (event) => {
    const sidebar = ReactDOM.findDOMNode(this._sidebarRef);
    const toggleButton = document.getElementById('sidebar-toggle-button');

    if (!sidebar) {
      return;
    }

    if (
      !sidebar.contains(event.target) &&
      !toggleButton.contains(event.target) &&
      this.props.isSidebarVisible
    ) {
      this.props.onSidebarVisibleChange(false);
    }
  }

  onWindowScroll = () => {
    this.setState(getPositioning());
  }

  onTouchStart = (event) => {
    const touches = event.touches;
    const touchStart = touches[0].pageX;
    const isSidebarVisible = this.props.isSidebarVisible;

    if (touches.length !== 1) {
      return;
    }

    if (isSidebarVisible && (touchStart > 210 || touchStart < 50)) {
      return;
    } else if (!isSidebarVisible && touchStart > 50) {
      return;
    }

    this._touchStart = touchStart;
  }

  onTouchEnd = (event) => {
    this._touchStart = null;
  }

  onTouchCancel = (event) => {
    this._touchStart = null;
  }

  onTouchMove = (event) => {
    const touches = event.touches;
    const currentTouch = touches[0].pageX;

    if (
      touches.length !== 1 ||
      this._touchStart == null ||
      Math.abs(this._touchStart - currentTouch) < 20
    ) {
      return;
    }

    if (currentTouch > this._touchStart && currentTouch > 50) {
      this.props.onSidebarVisibleChange(true);
    } else if (currentTouch < this._touchStart && currentTouch < 80) {
      this.props.onSidebarVisibleChange(false);
    } else {
      const transform = Math.min(SIDEBAR_WIDTH - currentTouch, 0);

      this.setState({
        transform
      });
    }
  }

  //
  // Render

  render() {
    const {
      location,
      isSmallScreen
    } = this.props;

    const {
      top,
      height,
      transform
    } = this.state;

    const urlBase = window.Sonarr.urlBase;
    const pathname = urlBase ? location.pathname.substr(urlBase.length) || '/' : location.pathname;
    const activeParent = getActiveParent(pathname);

    let containerStyle = {};
    let sidebarStyle = {};

    if (isSmallScreen) {
      containerStyle = {
        transform: `translateX(${transform}px)`
      };

      sidebarStyle = {
        top,
        height
      };
    }

    const ScrollerComponent = isSmallScreen ? Scroller : OverlayScroller;

    return (
      <div
        ref={this._setSidebarRef}
        className={classNames(
          styles.sidebarContainer
        )}
        style={containerStyle}
      >
        <ScrollerComponent
          className={styles.sidebar}
          style={sidebarStyle}
        >
          <div>
            {
              links.map((link) => {
                const childWithStatusComponent = _.find(link.children, (child) => {
                  return !!child.statusComponent;
                });

                const childStatusComponent = childWithStatusComponent ?
                  childWithStatusComponent.statusComponent :
                  null;

                const isActiveParent = activeParent === link.to;
                const hasActiveChild = hasActiveChildLink(link, pathname);

                return (
                  <PageSidebarItem
                    key={link.to}
                    iconName={link.iconName}
                    title={link.title}
                    to={link.to}
                    statusComponent={isActiveParent || !childStatusComponent ? link.statusComponent : childStatusComponent}
                    isActive={pathname === link.to && !hasActiveChild}
                    isActiveParent={isActiveParent}
                  >
                    {
                      link.children && link.to === activeParent &&
                        link.children.map((child) => {
                          return (
                            <PageSidebarItem
                              key={child.to}
                              title={child.title}
                              to={child.to}
                              isActive={pathname === child.to}
                              isChildItem={true}
                              statusComponent={child.statusComponent}
                            />
                          );
                        })
                    }
                  </PageSidebarItem>
                );
              })
            }
          </div>

          <MessagesConnector />
        </ScrollerComponent>
      </div>
    );
  }
}

PageSidebar.propTypes = {
  location: locationShape.isRequired,
  isSmallScreen: PropTypes.bool.isRequired,
  isSidebarVisible: PropTypes.bool.isRequired,
  onSidebarVisibleChange: PropTypes.func.isRequired
};

export default PageSidebar;
