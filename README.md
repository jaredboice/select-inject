# Copyright 2018 Jared Boice (MIT License / Open Source)

# Select-Inject - Documentation

![Select-Inject](screenshots/select-inject-logo.png 'select-inject')

## Donations - Bitcoin: 19XgiRojJnv9VDhyW9HmF6oKQeVc7k9McU (use this address until 2020)

## Description

**Select-Inject** is a fully customizable _react_ _multi-select_ system that can be used independently or injected into an expander/drawer/dropdown that accepts standalone components, such as uptown-dropdown. It offers adjustable orientation, applied css class names for each state of the component, switches for disabling the component at both the item and container level, selection limits, and both item-level and container-level click handler callbacks that accept an object of parameters: element, index (selected index), selected (all currently selected indices), and selectedUids.

**Uptown-Dropdown Integration:** _(click [here](https://www.npmjs.com/package/uptown-dropdown "Uptown-Dropdown") to navigate to the uptown-dropdown npm page)_  
if you need a customizable react expander/dropdown, Select-Inject can be used with Uptown-Dropdown.

## Install, Import & Instantiate

**Install**

`npm install --save select-inject`

**Import**

```javascript  
import SelectInject from 'select-inject';

```
**Instantiation Example: Defining Props**

```javascript
const selectInjectProps = {
    name: 'my-crypto-selections', // becomes the name of the css pivot class and will be used as part of a fallback render key when the item-level uid cannot be used
    uid: Symbol('my-crypto-selections'), // unique identifier: passing a unique id on each render ensures accurate real-time rendering when props update (more details in uid section in the full documentation)
    multi: true, // multi-select or single select
    multiMode: 'cycle', // multi-select modes: defines the component's behavior when selectLimit is reached - 'stop' || 'cycle'
    selectLimit: 3, // selection limit: null or negative values represent no limit
    selected: [0, 1], // define the selected index/indices - the container level uid must be different from the previous container level uid when passing selected props
    disabled: false, // disables select/click events for the entire component
    linkStyles: true, // // applies link-appropriate styles to the items: eg. { cursor: 'pointer', userSelect: 'none'}
    orientation: 'vertical', // 'vertical' || 'vertical-reverse' || 'horizontal' || 'horizontal-reverse' || 'none'
    data: [
        {
            uid: Symbol('my-crypto-selections'), // while updating the data array, real-time rendering can be achieved if each item-level uid is unique, and the container level uid is identical to the previous render's container-level uid; also first in line to be used as the item render key
            selectable: true, // represents an item that can be selected
            disabled: false, // disables select/click events for this item
            classList: 'custom-class', // apply a custom class/classList
            content: <div>bitcoin</div>, // jsx || string || number
            handleClick: (params) => {
                // item-level click handler - parameters: { element, index, selected, selectedUids }
                console.log('item-level click handler');
                console.log('selected index: ', params.index);
                console.log('selected indices: ', params.selected);
            }
        },
        {
            uid: Symbol('my-crypto-selections'),
            selectable: true,
            disabled: false,
            classList: null,
            content: <div>ethereum</div>,
            handleClick: (params) => {
                console.log('item-level click handler');
                console.log('selected index: ', params.index);
                console.log('selected indices: ', params.selected);
            }
        },
        {
            uid: Symbol('my-crypto-selections'),
            selectable: true,
            disabled: false,
            classList: null,
            content: <div>dash</div>,
            handleClick: (params) => {
                console.log('item-level click handler');
                console.log('selected index: ', params.index);
                console.log('selected indices: ', params.selected);
            }
        },
        {
            uid: Symbol('my-crypto-selections'),
            selectable: true,
            disabled: false,
            classList: null,
            content: <div>litecoin</div>,
            handleClick: (params) => {
                console.log('item-level click handler');
                console.log('selected index: ', params.index);
                console.log('selected indices: ', params.selected);
            }
        },
        {
            uid: Symbol('my-crypto-selections'),
            selectable: true,
            disabled: false,
            classList: null,
            content: <div>iota</div>,
            handleClick: (params) => {
                console.log('item-level click handler');
                console.log('selected index: ', params.index);
                console.log('selected indices: ', params.selected);
            }
        }
    ],
    handleClick: (params) => {
        // container-level click handler - parameters: { element, index, selected, selectedUids }
        console.log('container-level click handler');
        console.log('selected index: ', params.index);
        console.log('selected indices: ', params.selected);
    }
};
```

**Instantiation Example: Standalone Select-Inject Instance**

```javascript
return (
    <section>
        <SelectInject { ...selectInjectProps } />
    </section>
);
```

**Instantiation Example: Integrating Select-Inject into Uptown-Dropdown** _(click [here](https://www.npmjs.com/package/uptown-dropdown "Uptown-Dropdown") to navigate to the uptown-dropdown npm page)_

```javascript
return (
    <section>
        <UptownDropdown
            name="my-uptown-dropdown-component"
            uid={Symbol('my-uptown-dropdown-component')}
            placeholder="cryptos"
            centerPlaceholder={true}
            anime={true}
            border="1px solid dimgray"
            borderRadius="3px"
            BodyComp={SelectInject}
            bodyCompProps={{ ...selectInjectProps }}
            componentType="dropdown"
            triggerType="clickAndHover"
            orientation="vertical"
            handleClick={(expandedState) => {console.log('expanded the uptown body')}}
            linkStyles={true}
            disabled={false} 
        />
    </section>
);
```

**Props**

```javascript
SelectInject.propTypes = {
    name: PropTypes.string,
    uid: PropTypes.oneOfType([PropTypes.symbol, PropTypes.string, PropTypes.number]),
    multi: PropTypes.bool,
    multiMode: PropTypes.string,
    selectLimit: PropTypes.number,
    selected: PropTypes.arrayOf(PropTypes.number),
    disabled: PropTypes.bool,
    linkStyles: PropTypes.bool,
    flexBasis: PropTypes.string, // eg. '200px' - quick-starter setting for synchronizing the flex-basis of the container and the items
    minWidth: PropTypes.string, // eg. '200px' - quick-starter setting for synchronizing the min-width of the container and the items
    minHeight: PropTypes.string, // eg. '200px' - quick-starter setting for synchronizing the min-height of the container and the items
    maxWidth: PropTypes.string, // eg. '200px' - quick-starter setting for synchronizing the max-width of the container and the items
    maxHeight: PropTypes.string, // eg. '200px' - quick-starter setting for synchronizing the max-height of the container and the items
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
    handleClick: (params) => {}
};
```

## CSS ClassNames Applied by State

**container**

*   `select-inject-container __select-inject-container-disabled ${name}` _(container-level disabled is true)_  
*   `select-inject-container __select-inject-container-enabled ${name}` _(container-level disabled is false)_

**items**

*   `__select-inject-item-selected` _(item is selected)_  
*   `__select-inject-item-selectable` _(selectable is true)_  
*   `__select-inject-item-clickable` _(item-level handleClick is not null)_  
*   `__select-inject-item-disabled` _(item-level disabled is true)_  
*   `__select-inject-item-enabled` _(item-level disabled is false)_  
*   `custom-class-name` _(via item-level classList)_

## Quick Starter Presets

_when provided, the following props will be applied to both the container and the items. they can then be overridden with !important styles in your css_

**flexBasis**  
**minWidth**  
**minHeight**  
**maxWidth**  
**maxHeight**

## UID System

UIDs are Unique IDentifiers that are used to ensure accurate real-time rendering when props update.

1. Each item-level UID should always be unique as there are scenarios when select-inject will use these UIDs to determine if an item is still selected during prop updates.
2. Issue a new container-level UID when passing "selected" props. This is required in order for the new "selected" props to be recognized.
3. Maintain the same container-level UID from the previous render when adding/removing new elements to the (otherwise) same previous data array. This is required for select-inject to remember the previously "selected" items.

**jsx structure**

```javascript
<section className={containerClassList} style={{ ...containerInlineStyles }}>
    <div {...itemAttributes}>{element.content}</div>
    <div {...itemAttributes}>{element.content}</div>
    <div {...itemAttributes}>{element.content}</div>
    ...
    ...
    ...
</section>
```