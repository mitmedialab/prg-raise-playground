import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import {FormattedMessage} from 'react-intl';

import styles from './crash-message.css';
import reloadIcon from './reload.svg';

const CrashMessage = props => (
    <div className={styles.crashWrapper}>
        <Box className={styles.body}>
            <img
                className={styles.reloadIcon}
                src={reloadIcon}
            />
            <h2>
                <FormattedMessage
                    defaultMessage="Oops! Something went wrong."
                    description="Crash Message title"
                    id="gui.crashMessage.label"
                />
            </h2>
            <p>
                We are so sorry, but it looks like the block editor has crashed.<br/>
                This bug has been automatically reported to the team.<br/>
                Please refresh your page to try again.<br/>
            </p>
            {props.eventId && (
                <p>
                    <FormattedMessage
                        defaultMessage="Your error was logged with id {errorId}"
                        description="Message to inform the user that page has crashed."
                        id="gui.crashMessage.errorNumber"
                        values={{
                            errorId: props.eventId
                        }}
                    />
                </p>
            )}
            <a
                href="https://dancingwithai.github.io/?"
                className={styles.reloadButton}
                style={{textDecoration: 'none', display: 'inline-block', marginBottom: 14}}
            >
                Back to Curriculum
            </a><br/>
            <button
                className={styles.reloadButton}
                onClick={props.onReload}
            >
                <FormattedMessage
                    defaultMessage="Reload"
                    description="Button to reload the page when page crashes"
                    id="gui.crashMessage.reload"
                />
            </button>
        </Box>
    </div>
);

CrashMessage.propTypes = {
    eventId: PropTypes.string,
    onReload: PropTypes.func.isRequired
};

export default CrashMessage;
