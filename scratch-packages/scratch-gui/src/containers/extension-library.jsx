import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import { addLocaleData, defineMessages, injectIntl, intlShape } from 'react-intl';

import extensionLibraryContent from '../lib/libraries/extensions/index.jsx';

import LibraryComponent from '../components/library/library.jsx';
import extensionIcon from '../components/action-menu/icon--sprite.svg';
import { allLocales, addToLocale } from '../reducers/locales.js';

const messages = defineMessages({
    extensionTitle: {
        defaultMessage: 'Choose an Extension',
        description: 'Heading for the extension library',
        id: 'gui.extensionLibrary.chooseAnExtension'
    },
    extensionUrl: {
        defaultMessage: 'Enter the URL of the extension',
        description: 'Prompt for unoffical extension url',
        id: 'gui.extensionLibrary.extensionUrl'
    }
});

const makeTranslationLabel = (tag) => ({
    defaultMessage: tag,
    description: `${tag} -- Tag for filtering a library for everything`,
    id: `gui.extensionTags.${tag}`
});

class ExtensionLibrary extends React.PureComponent {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleItemSelect'
        ]);
        extensionLibraryContent.forEach(extension => {
            allLocales.forEach(locale => {
                if (!(locale in extension)) return;
                const { extensionId } = extension;
                const { name, description } = extension[locale];
                addToLocale(locale, `extension.${extensionId}.name`, name);
                addToLocale(locale, `extension.${extensionId}.description`, description);
            });
        });
    }
    handleItemSelect(item) {
        const id = item.extensionId;
        let url = item.extensionURL ? item.extensionURL : id;
        if (!item.disabled && !id) {
            // eslint-disable-next-line no-alert
            url = prompt(this.props.intl.formatMessage(messages.extensionUrl));
        }
        if (id && !item.disabled) {
            if (this.props.vm.extensionManager.isExtensionLoaded(url)) {
                this.props.onCategorySelected(id);
            } else {
                this.props.vm.extensionManager.loadExtensionURL(url).then(() => {
                    this.props.onCategorySelected(id);
                });
            }
        }
    }
    render() {
        const extensionLibraryThumbnailData = extensionLibraryContent
            .map(({ iconURL, extensionId, tags, ...rest }) => {
                const uniqueURL = iconURL ? `${iconURL}?key=${extensionId}` : extensionIcon;
                return { rawURL: uniqueURL, iconURL: uniqueURL, extensionId, tags: tags ?? [], ...rest };
            })
            .sort((a, b) => {
                if (a.tags?.includes('PRG Internal') || a.tags?.length === 0) return 1;
                if (b.tags?.includes('PRG Internal') || b.tags?.length === 0) return -1;
                return 0;
            })

        const uniqueTags = Array.from(new Set(extensionLibraryThumbnailData.map(({ tags }) => tags).flat()));
        const tags = uniqueTags.map(tag => ({ tag, intlLabel: makeTranslationLabel(tag) }));

        return (
            <LibraryComponent
                data={extensionLibraryThumbnailData}
                filterable={true}
                tags={tags}
                id="extensionLibrary"
                title={this.props.intl.formatMessage(messages.extensionTitle)}
                visible={this.props.visible}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

ExtensionLibrary.propTypes = {
    intl: intlShape.isRequired,
    onCategorySelected: PropTypes.func,
    onRequestClose: PropTypes.func,
    visible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired // eslint-disable-line react/no-unused-prop-types
};

export default injectIntl(ExtensionLibrary);
