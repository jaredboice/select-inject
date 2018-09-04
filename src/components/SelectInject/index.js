import React from 'react';
import PropTypes from 'prop-types';

const STOP = 'stop';
const CYCLE = 'cycle';

const VERTICAL = 'vertical';
const VERTICAL_REVERSE = 'vertical-reverse';
const HORIZONTAL = 'horizontal';
const HORIZONTAL_REVERSE = 'horizontal-reverse';
const NONE = 'none';

const integrateArrayOfStyleObjects = (arrayOfStyleObjects, inlineStyles = {}) => {
    arrayOfStyleObjects.forEach((obj) => {
        inlineStyles = {
            ...inlineStyles,
            ...obj
        };
    });
    return inlineStyles;
};

const arrayContains = (targetElement, sourceArray) => {
    let match = false;
    const length = sourceArray.length;
    for (let looper = 0; looper < length; looper++) {
        if (sourceArray[looper] === targetElement) {
            match = true;
            break;
        }
    }
    return match;
};

class SelectInject extends React.Component {
    constructor(props) {
        super(props);
        const { selected, data } = this.props;
        const selectedUids = selected.map((selectionIndex) => {
            return data[selectionIndex].uid;
        });
        this.state = {
            selectedIndices: selected,
            selectedUids: selectedUids || [],
            selectionCount: selected.length || 0
        };
        this.renderCount = 0;
        this.clickHandlerSingular = this.clickHandlerSingular.bind(this);
        this.clickHandlerMulti = this.clickHandlerMulti.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.renderCount > 0) {
            const { uid, data } = this.props;
            const nextPropsUid = nextProps.uid;
            const nextPropsSelected = nextProps.selected;
            const nextPropsData = nextProps.data;
            const previousRenderId = uid || null;
            const nextRenderId = nextPropsUid || null;
            // this block allows you to pass down selected props
            if (
                nextRenderId &&
                nextRenderId != previousRenderId && // eslint-disable-line eqeqeq
                nextProps &&
                (nextPropsSelected && nextPropsSelected.length > 0)
            ) {
                const selectedUids = nextPropsSelected.map((selectionIndex) => {
                    return data[selectionIndex].uid;
                });

                this.setState({
                    selectedIndices: [...nextPropsSelected],
                    selectedUids: [...selectedUids],
                    selectionCount: nextPropsSelected.length
                });
            } else {
                // this block allows real-time updating of the data array
                const newSelectedIndices = [];
                const newSelectedUids = [];
                let setState = false;
                this.state.selectedUids.forEach((uid) => {
                    nextPropsData.forEach((element, elementIndex) => {
                        if (uid == element.uid) {
                            // eslint-disable-line eqeqeq
                            newSelectedIndices.push(elementIndex);
                            newSelectedUids.push(uid);
                            setState = true;
                        }
                    });
                });
                if (setState) {
                    this.setState({
                        selectedIndices: [...newSelectedIndices],
                        selectedUids: [...newSelectedUids],
                        selectionCount: newSelectedIndices.length
                    });
                }
            }
        }
    }

    buildItemAttributes({
        name,
        element,
        index,
        selectable,
        disabled,
        disabledContainer,
        handleClick,
        itemInlineStyleCollection,
        selectedIndices,
        selectedUids,
        itemClassList,
        linkStyles,
        clickHandler,
        selectionCount,
        selectLimit,
        multiMode
    }) {
        if (linkStyles && ((handleClick || selectable) && (!disabled && !disabledContainer))) {
            itemInlineStyleCollection.push({ cursor: 'pointer', userSelect: 'none' });
        } else if (linkStyles && (!disabled && !disabledContainer)) {
            itemInlineStyleCollection.push({ userSelect: 'none' });
        } else if (linkStyles && (disabled || disabledContainer)) {
            itemInlineStyleCollection.push({ cursor: 'not-allowed', userSelect: 'none' });
        }
        const transientItemInlineStyles = integrateArrayOfStyleObjects(itemInlineStyleCollection);
        const renderKey =
            element.uid && typeof element.uid !== 'symbol' ? element.uid : `select-inject-${name}-item-${index + 1}`;
        const itemAttributes = {
            style: { ...transientItemInlineStyles },
            className: itemClassList,
            key: renderKey,
            onClick: () => {
                clickHandler({
                    element,
                    index,
                    selectedIndices,
                    selectedUids,
                    disabledContainer,
                    selectionCount,
                    selectLimit,
                    multiMode
                });
            }
        };
        return itemAttributes;
    }

    buildItemClassList({ index, selectable, disabled, classList, handleClick, selectedIndices }) {
        let itemClassList = '';
        if (selectable) itemClassList = `${itemClassList} __select-inject-item-selectable`;
        if (handleClick) itemClassList = `${itemClassList} __select-inject-item-clickable`;
        if (disabled) {
            itemClassList = `${itemClassList} __select-inject-item-disabled`;
        } else {
            itemClassList = `${itemClassList} __select-inject-item-enabled`;
        }
        if (classList) itemClassList = `${itemClassList} ${classList}`;
        if (selectedIndices && selectedIndices.length > 0) {
            const match = arrayContains(index, selectedIndices);
            if (match) {
                itemClassList = `${itemClassList} __select-inject-item-selected`;
            } else {
                itemClassList = `${itemClassList} __select-inject-item-not-selected`;
            }
        }
        return itemClassList;
    }

    clickHandlerMulti({
        element,
        index,
        selectedIndices,
        selectedUids,
        disabledContainer,
        selectionCount,
        selectLimit,
        multiMode
    }) {
        const { selectable, handleClick } = element;
        const clickHandlerContainer = this.props.handleClick || null;
        let transientSelectedIndices = [];
        let transientSelectedUids = [];
        if (!disabledContainer && !element.disabled) {
            if (selectable) {
                let addSelected = false;
                let removeSelected = false;
                const match = arrayContains(index, selectedIndices);
                if (match) {
                    removeSelected = true;
                    transientSelectedIndices = selectedIndices.filter((selectedIndex) => {
                        return selectedIndex !== index;
                    });
                    transientSelectedUids = selectedUids.filter((selectedUid) => {
                        return selectedUid !== element.uid;
                    });
                } else if (selectionCount == selectLimit) {
                    transientSelectedIndices = [...selectedIndices];
                    transientSelectedUids = [...selectedUids];
                    switch (multiMode) {
                        case STOP:
                            addSelected = false;
                            break;
                        case CYCLE:
                            addSelected = true;
                            transientSelectedIndices.push(index);
                            transientSelectedIndices.shift();
                            transientSelectedUids.push(element.uid || null);
                            transientSelectedUids.shift();
                            break;
                        default:
                            break;
                    }
                } else {
                    addSelected = true;
                    transientSelectedIndices = [...selectedIndices];
                    transientSelectedUids = [...selectedUids];
                    transientSelectedIndices.push(index);
                    transientSelectedUids.push(element.uid || null);
                }
                if (addSelected || removeSelected) {
                    this.setState({
                        selectedIndices: [...transientSelectedIndices],
                        selectedUids: [...transientSelectedUids],
                        selectionCount: transientSelectedIndices.length
                    });
                }
            }
            let selectedParams = null;
            let uidParams = null;
            if (handleClick || clickHandlerContainer) {
                const indexOfCurrentIndex = selectedIndices.indexOf(index);
                selectedParams = [];
                if (indexOfCurrentIndex >= 0) {
                    const ephemeralSelectedIndices = selectedIndices.filter((selectedIndex) => {
                        return selectedIndex !== index;
                    });
                    selectedParams = [...ephemeralSelectedIndices];
                } else if (indexOfCurrentIndex < 0 && selectLimit !== selectedIndices.length) {
                    const ephemeralSelectedIndices = [...selectedIndices];
                    ephemeralSelectedIndices.push(index);
                    selectedParams = [...ephemeralSelectedIndices];
                } else if (indexOfCurrentIndex < 0 && selectLimit === selectedIndices.length) {
                    if (multiMode === STOP) {
                        const ephemeralSelectedIndices = [...selectedIndices];
                        selectedParams = [...ephemeralSelectedIndices];
                    } else {
                        const ephemeralSelectedIndices = [...selectedIndices];
                        ephemeralSelectedIndices.push(index);
                        ephemeralSelectedIndices.shift();
                        selectedParams = [...ephemeralSelectedIndices];
                    }
                }
                const elementUid = element.uid;
                const indexOfElementUid = selectedUids.indexOf(elementUid);
                uidParams = [];
                if (indexOfElementUid >= 0) {
                    const ephemeralUids = selectedUids.filter((selectedUid) => {
                        return selectedUid != element.uid;
                    });
                    uidParams = [...ephemeralUids];
                } else if (indexOfElementUid < 0 && selectLimit !== selectedUids.length) {
                    const ephemeralUids = [...selectedUids];
                    ephemeralUids.push(elementUid);
                    uidParams = [...ephemeralUids];
                } else if (indexOfElementUid < 0 && selectLimit === selectedUids.length) {
                    if (multiMode === STOP) {
                        const ephemeralUids = [...selectedUids];
                        uidParams = [...ephemeralUids];
                    } else {
                        const ephemeralUids = [...selectedUids];
                        ephemeralUids.push(elementUid);
                        ephemeralUids.shift();
                        uidParams = [...ephemeralUids];
                    }
                }
            }
            if (handleClick) {
                handleClick({ element, index, selected: [...selectedParams] || [...selectedIndices], selectedUids: [...uidParams] || [...selectedUids] }); // TODO: are the || condtions needed?
            }
            if (clickHandlerContainer) {
                clickHandlerContainer({ element, index, selected: [...selectedParams] || [...selectedIndices], selectedUids: [...uidParams] || [...selectedUids] }); // TODO: are the || condtions needed?
            }
        }
    }

    clickHandlerSingular({ element, index, selectedIndices, selectedUids, disabledContainer }) {
        const { selectable, handleClick } = element;
        const clickHandlerContainer = this.props.handleClick || null;
        if (!disabledContainer && !element.disabled) {
            if (selectable) {
                if (index === selectedIndices[0]) {
                    this.setState({ selectedIndices: [], selectedUids: [] });
                } else {
                    this.setState({ selectedIndices: [index], selectedUids: [element.uid] });
                }
            }
            let selectedParams = null;
            let uidParams = null;
            if (handleClick || clickHandlerContainer) {
                const indexOfCurrentIndex = selectedIndices.indexOf(index);
                selectedParams = [];
                if (indexOfCurrentIndex >= 0) {
                    selectedParams = [];
                } else {
                    selectedParams = [index];
                }
                const indexOfElementUid = selectedUids.indexOf(element.uid);
                uidParams = [];
                if (indexOfElementUid >= 0) {
                    uidParams = [];
                } else {
                    uidParams = [element.uid];
                }
            }
            if (handleClick) {
                handleClick({ element, index, selected: [...selectedParams] || [...selectedIndices], selectedUids: [...uidParams] || [...selectedUids] });
            }
            if (clickHandlerContainer) { // TODO: test
                clickHandlerContainer({ element, index, selected: [...selectedParams] || [...selectedIndices], selectedUids: [...uidParams] || [...selectedUids] });
            }
        }
    }

    renderItem({
        name,
        element,
        index,
        selectedIndices,
        selectedUids,
        disabledContainer,
        clickHandler,
        itemInlineStyleCollection,
        selectionCount,
        selectLimit,
        multiMode
    }) {
        const { linkStyles } = this.props;
        const { selectable, disabled, classList, handleClick } = element;
        // build item attributes
        const itemClassList = this.buildItemClassList({
            index,
            selectable,
            disabled,
            classList,
            handleClick,
            selectedIndices
        });
        const itemAttributes = this.buildItemAttributes({
            name,
            element,
            index,
            selectable,
            disabled,
            disabledContainer,
            clickHandler,
            itemInlineStyleCollection,
            selectedIndices,
            selectedUids,
            itemClassList,
            linkStyles,
            handleClick,
            selectionCount,
            selectLimit,
            multiMode
        });
        return <div {...itemAttributes}>{element.content}</div>;
    }

    render() {
        this.renderCount++;
        const {
            name,
            multi,
            multiMode,
            selectLimit,
            disabled,
            flexBasis,
            minWidth,
            minHeight,
            maxWidth,
            maxHeight,
            orientation,
            data
        } = this.props;
        const { selectedIndices, selectedUids, selectionCount } = this.state;
        const containerClassList = !disabled
            ? `select-inject-container select-inject-container-enabled __select-inject-container-enabled ${name}`
            : `select-inject-container select-inject-container-disabled __select-inject-container-disabled ${name}`;
        const containerInlineStyleCollection = [];
        const itemInlineStyleCollection = [];
        switch (orientation) {
            case VERTICAL:
            case VERTICAL_REVERSE:
                containerInlineStyleCollection.push({
                    display: 'flex',
                    flexDirection: 'column'
                });
                break;
            case HORIZONTAL:
            case HORIZONTAL_REVERSE:
                containerInlineStyleCollection.push({
                    display: 'flex',
                    flexDirection: 'row'
                });
                break;
            case NONE:
                containerInlineStyleCollection.push({});
                break;
            default:
                containerInlineStyleCollection.push({});
                break;
        }
        if (flexBasis) {
            containerInlineStyleCollection.push({ flexBasis: `${flexBasis}` });
            itemInlineStyleCollection.push({ flexBasis: `${flexBasis}` });
        }
        if (minWidth) {
            containerInlineStyleCollection.push({ minWidth: `${minWidth}` });
            itemInlineStyleCollection.push({ minWidth: `${minWidth}` });
        }
        if (minHeight) {
            containerInlineStyleCollection.push({ minHeight: `${minHeight}` });
            itemInlineStyleCollection.push({ minHeight: `${minHeight}` });
        }
        if (maxWidth) {
            containerInlineStyleCollection.push({ maxWidth: `${maxWidth}` });
            itemInlineStyleCollection.push({ maxWidth: `${maxWidth}` });
        }
        if (maxHeight) {
            containerInlineStyleCollection.push({ maxHeight: `${maxHeight}` });
            itemInlineStyleCollection.push({ maxHeight: `${maxHeight}` });
        }
        const containerInlineStyles = integrateArrayOfStyleObjects(containerInlineStyleCollection);
        const parameterPackage = multi
            ? {
                  name,
                  selectedIndices,
                  selectedUids,
                  disabledContainer: disabled,
                  clickHandler: this.clickHandlerMulti,
                  itemInlineStyleCollection,
                  selectionCount,
                  selectLimit,
                  multiMode
              }
            : {
                  name,
                  selectedIndices,
                  selectedUids,
                  disabledContainer: disabled,
                  clickHandler: this.clickHandlerSingular,
                  itemInlineStyleCollection
              };
        const dataPackage = () => {
            if (orientation === VERTICAL || orientation === HORIZONTAL || orientation === NONE) {
                return data.map((element, index) => {
                    return this.renderItem({ ...parameterPackage, element, index });
                });
            } // else reverse
            return data
                .map((element, index) => {
                    return this.renderItem({ ...parameterPackage, element, index });
                })
                .reverse();
        };
        return (
            <section className={containerClassList} style={{ ...containerInlineStyles }}>
                {dataPackage()}
            </section>
        );
    }
}

SelectInject.propTypes = {
    name: PropTypes.string,
    uid: PropTypes.oneOfType([PropTypes.symbol, PropTypes.string, PropTypes.number]),
    multi: PropTypes.bool,
    multiMode: PropTypes.string,
    selectLimit: PropTypes.number,
    selected: PropTypes.arrayOf(PropTypes.number),
    disabled: PropTypes.bool,
    linkStyles: PropTypes.bool,
    flexBasis: PropTypes.string,
    minWidth: PropTypes.string,
    minHeight: PropTypes.string,
    maxWidth: PropTypes.string,
    maxHeight: PropTypes.string,
    orientation: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleClick: PropTypes.func
};
SelectInject.defaultProps = {
    name: 'default-select-inject-name',
    uid: null,
    multi: false,
    multiMode: STOP,
    selectLimit: null,
    selected: [],
    disabled: false,
    linkStyles: false,
    flexBasis: null,
    minWidth: null,
    minHeight: null,
    maxWidth: null,
    maxHeight: null,
    orientation: NONE,
    handleClick: () => {}
};
// eslint-disable-next-line import/prefer-default-export
export { SelectInject };
