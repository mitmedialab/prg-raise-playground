import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {useMemo} from 'react';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';

import LanguageMenu from './language-menu.jsx';
import MenuBarMenu from './menu-bar-menu.jsx';
import {MenuSection} from '../menu/menu.jsx';
import PreferenceMenu from './preference-menu.jsx';

import {DEFAULT_MODE, HIGH_CONTRAST_MODE, colorModeMap} from '../../lib/settings/color-mode/index.js';
import {themeMap} from '../../lib/settings/theme/index.js';
import {persistColorMode} from '../../lib/settings/color-mode/persistence.js';
import {persistTheme} from '../../lib/settings/theme/persistence.js';
import {setColorMode, setTheme} from '../../reducers/settings.js';

import menuBarStyles from './menu-bar.css';
import styles from './settings-menu.css';

import dropdownCaret from './dropdown-caret.svg';
import settingsIcon from './icon--settings.svg';
import themeIcon from '../../lib/assets/icon--theme.svg';
import {colorModeMenuOpen, themeMenuOpen, openColorModeMenu, openThemeMenu} from '../../reducers/menus.js';

const enabledColorModes = [DEFAULT_MODE, HIGH_CONTRAST_MODE];

const SettingsMenu = ({
    canChangeLanguage,
    canChangeColorMode,
    canChangeTheme,
    hasActiveMembership,
    isRtl,
    isColorModeMenuOpen,
    isThemeMenuOpen,
    activeColorMode,
    onChangeColorMode,
    onRequestOpenColorMode,
    onRequestOpenTheme,
    activeTheme,
    onChangeTheme,
    onRequestClose,
    onRequestOpen,
    settingsMenuOpen
}) => {
    const enabledColorModesMap = useMemo(() => Object.keys(colorModeMap).reduce((acc, colorMode) => {
        if (enabledColorModes.includes(colorMode)) {
            acc[colorMode] = colorModeMap[colorMode];
        }
        return acc;
    }, {}), []);
    const availableThemesMap = useMemo(() => Object.keys(themeMap).reduce((acc, themeKey) => {
        const theme = themeMap[themeKey];
        if (theme.isAvailable?.({hasActiveMembership})) {
            acc[themeKey] = theme;
        }
        return acc;
    }, {}), [hasActiveMembership]);
    const availableThemesLength = useMemo(() => Object.keys(availableThemesMap).length, [availableThemesMap]);

    return (
        <div
            className={classNames(menuBarStyles.menuBarItem, menuBarStyles.hoverable, menuBarStyles.colorModeMenu, {
                [menuBarStyles.active]: settingsMenuOpen
            })}
            onClick={onRequestOpen}
        >
            <img
                src={settingsIcon}
            />
            <span className={styles.dropdownLabel}>
                <FormattedMessage
                    defaultMessage="Settings"
                    description="Settings menu"
                    id="gui.menuBar.settings"
                />
            </span>
            <img src={dropdownCaret} />
            <MenuBarMenu
                className={menuBarStyles.menuBarMenu}
                open={settingsMenuOpen}
                place={isRtl ? 'left' : 'right'}
                onRequestClose={onRequestClose}
            >
                <MenuSection>
                    {canChangeLanguage && <LanguageMenu onRequestCloseSettings={onRequestClose} />}
                    {canChangeTheme &&
                        // TODO: Consider always showing the theme menu, even if there is a single available theme
                        availableThemesLength > 1 &&
                        <PreferenceMenu
                            open={isThemeMenuOpen}
                            itemsMap={availableThemesMap}
                            onChange={onChangeTheme}
                            defaultMenuIconSrc={themeIcon}
                            submenuLabel={{
                                defaultMessage: 'Theme',
                                description: 'Theme sub-menu',
                                id: 'gui.menuBar.theme'
                            }}
                            selectedItemKey={activeTheme}
                            isRtl={isRtl}
                            onRequestCloseSettings={onRequestClose}
                            onRequestOpen={onRequestOpenTheme}
                        />}
                    {canChangeColorMode && <PreferenceMenu
                        open={isColorModeMenuOpen}
                        itemsMap={enabledColorModesMap}
                        onChange={onChangeColorMode}
                        submenuLabel={{
                            defaultMessage: 'Color Mode',
                            description: 'Color mode sub-menu',
                            id: 'gui.menuBar.colorMode'
                        }}
                        selectedItemKey={activeColorMode}
                        isRtl={isRtl}
                        onRequestCloseSettings={onRequestClose}
                        onRequestOpen={onRequestOpenColorMode}
                    />}
                </MenuSection>
            </MenuBarMenu>
        </div>
    );
};

SettingsMenu.propTypes = {
    canChangeLanguage: PropTypes.bool,
    canChangeColorMode: PropTypes.bool,
    canChangeTheme: PropTypes.bool,
    hasActiveMembership: PropTypes.bool,
    isRtl: PropTypes.bool,
    activeColorMode: PropTypes.string,
    onChangeColorMode: PropTypes.func,
    onRequestOpenColorMode: PropTypes.func,
    isColorModeMenuOpen: PropTypes.bool,
    activeTheme: PropTypes.string,
    onChangeTheme: PropTypes.func,
    onRequestOpenTheme: PropTypes.func,
    isThemeMenuOpen: PropTypes.bool,
    onRequestClose: PropTypes.func,
    onRequestOpen: PropTypes.func,
    settingsMenuOpen: PropTypes.bool
};

const mapStateToProps = state => ({
    activeColorMode: state.scratchGui.settings.colorMode,
    activeTheme: state.scratchGui.settings.theme,
    isColorModeMenuOpen: colorModeMenuOpen(state),
    isThemeMenuOpen: themeMenuOpen(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onRequestOpenColorMode: () => {
        dispatch(openColorModeMenu());
    },
    onRequestOpenTheme: () => {
        dispatch(openThemeMenu());
    },
    onChangeColorMode: colorMode => {
        dispatch(setColorMode(colorMode));
        ownProps.onRequestClose();
        persistColorMode(colorMode);
    },
    onChangeTheme: theme => {
        dispatch(setTheme(theme));
        ownProps.onRequestClose();
        persistTheme(theme);
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsMenu);
