import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './user-avatar.css';

const UserAvatar = ({
    className,
    wrapperClassName,
    imageUrl,
    showAvatarBadge = false
}) => (
    <div
        className={classNames(
            wrapperClassName,
            styles.avatarWrapper,
            showAvatarBadge && styles.avatarBadgeWrapper)
        }
    >
        <img
            className={classNames(
                className,
                styles.userThumbnail,
                showAvatarBadge && styles.avatarBadge
            )}
            src={imageUrl}
            referrerPolicy="no-referrer"
        />
    </div>
);

UserAvatar.propTypes = {
    className: PropTypes.string,
    wrapperClassName: PropTypes.string,
    imageUrl: PropTypes.string,
    showAvatarBadge: PropTypes.bool
};

export default UserAvatar;
