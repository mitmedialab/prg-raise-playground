import React, {createContext, useRef, useMemo, useCallback} from 'react';
import PropTypes from 'prop-types';

export const ModalFocusContext = createContext(null);

/**
 * A context provider that manages focus restoration strategies for modals.
 *
 * It keeps track of the element that was focused prior to a modal opening (`captureFocus`)
 * and attempts to restore focus to that element when the modal closes (`restoreFocus`).
 *
 * This uses a ref to store the DOM element, ensuring that focus restoration only occurs
 * if the original element is still connected to the DOM.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will have access to the context.
 * @returns {React.ReactElement} The Context Provider wrapping the children.
 */
export const ModalFocusProvider = ({children}) => {
    const lastFocusedElement = useRef(null);

    const captureFocus = useCallback(() => {
        lastFocusedElement.current = document.activeElement;
    }, []);

    const restoreFocus = useCallback(() => {
        if (lastFocusedElement.current?.isConnected) {
            lastFocusedElement.current.focus();
            lastFocusedElement.current = null;
        }
    }, []);

    const value = useMemo(
        () => ({
            captureFocus,
            restoreFocus
        }),
        [captureFocus, restoreFocus]
    );

    return (
        <ModalFocusContext.Provider value={value}>
            {children}
        </ModalFocusContext.Provider>
    );
};


ModalFocusProvider.propTypes = {
    children: PropTypes.node
};
