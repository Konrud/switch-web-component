# switch-web-component
Switch Web Component (Using Custom Elements v1 and Shadow DOM)

## Preview
[You can see it live](https://konrud.github.io/switch-web-component/Index.html)

## Summary
The `<switch-component></switch-component>` is functionally identical to the checkbox, except that instead of representing "checked" and "unchecked" states, it represents the states like "on" and "off". States might be changed via HTML attribute or via the property on the element itself.
Component doesn't receive any children.

## How to use
Download [`switch-web-component.js`](switch-web-component.js) file and link it in your HTML document. Declare `<switch-component></switch-component>` in your HTML document.
```html
<!DOCTYPE html>
<html lang="en">
<head>...</head>
 <body>

  <switch-component></switch-component>
  
  <script src="switch-web-component.js"></script>
 </body>
</html>
```

## Browser Support
Chrome 54, Edge 79, Firefox 63, Opera 41, Safari 10.1, iOS Safari 10.3, Samsung Internet 6.0

## Polyfills
- Standalone [polyfill](https://github.com/webcomponents/custom-elements/) for Custom Elements v1.
- A suite of polyfills supporting the Web Components specs: [webcomponents.js loader](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs)


## Attributes
Common attributes like `id`, `hidden` are supported and can be used as with the regular HTML Elements.

Component also supports the following attributes:

  ### name [read-only]
  Name of the component. Can be set only via HTML.
  ```javascript
    // get via property
    const switch = document.getElementById("switch");
    const name = switch.name;
  ```
  ```HTML
   // set on HTML Element
   <switch-component name="my-switch-component"></switch-component>
  ```

  ### init-state [read-only]
  Init state attribute can be set, at initialization, on the component in order to set its initial value for the `state` property. This property is read-only and can not be reassigned after the initialization. The value of this attribute must be equal to the `onLabel` property, otherwise it is considered as invalid at won't be reflected on the `state` property. 
  ```javascript
    // get via property
    const switch = document.getElementById("switch");
    const initState = switch.initState;
  ```
  ```HTML
   // set on HTML Element
   <switch-component init-state="open"></switch-component>
  ```

  ### state
  State property indicates current state of the component, by default `state` receives value from the `offLabel` property. Initial state can be set using `init-state` attribute on the component via HTML. Although this property is duplicated as HTML attribute on the component, it can not be manipulated directly via HTML. It's rather used in order to be some sort of indication of the component's current state, you can use it as a hook in your CSS.
  ```javascript
    // set via property
    const switch = document.getElementById("switch");
    switch.state = "open";
  ```
  ```css
    switch-component[state="open"] {
       background: firebrick;
    }
  ```
  
  **NOTE:** `state` property, if not set explicitly or via `init-state` property on the element's creation, will get its default value from the `offLabel` property (see below). It will be changed on each click of the component and get a value from the `onLabel` and `offLabel` properties respectively.
  
  ### disabled
  Disabled attribute indicates that component is disabled. This attribute is a boolean attribute, 
  that is, if specified on the component it sets to `true`, otherwise it will be `false`.
  When applied, component sets `aria-disabled="true"`, removes focus and can not be interacted by the user.
  This attribute can be set either via property or on the component itself in HTML.
  ```javascript
    // set via property
    const switch = document.getElementById("switch");
    switch.disabled = true;
  ```
  ```HTML
   // set on HTML Element
   <switch-component disabled></switch-component>
  ```
  
  ### elastic
  Elastic boolean attribute indicates that component's should apply elastic style on its lever. When clicked its lever will get an elastic style and animation.
  This attribute can be set both via HTML attribute and via property.  
  ```javascript
    // set via property
    const switch = document.getElementById("switch");
    switch.elastic = true;
  ```
  ```HTML
   // set on HTML Element
   <switch-component elastic></switch-component>
  ```
  
  ### on-label
  This attribute changes the default label when element is in the active state (e.g. "on").
  This attribute can be set via HTML attribute with the desired label or via property.
   ```javascript
    // set via property
    const switch = document.getElementById("switch");
    switch.onLabel = "open";
  ```
  ```HTML
   // set on HTML Element
   <switch-component on-label="open"></switch-component>
  ```
  
  ### off-label
  This attribute changes the default label when element is in the inactive state (e.g. "off").
  This attribute can be set via HTML attribute with the desired label or via property.
   ```javascript
    // set via property
    const switch = document.getElementById("switch");
    switch.offLabel = "close";
  ```
  ```HTML
   // set on HTML Element
   <switch-component off-label="close"></switch-component>
  ```
  
## Properties
Component supports the following properties:  

  ### name [read-only]
  Name of the component.
  
  ```javascript
    // get property value
    const switch = document.getElementById("switch");
    const name = switch.name;
  ```

  ### init-state [read-only]
  Determines component's initial value for the `state` property.
  
  ```javascript
    // get property's
    const switch = document.getElementById("switch");
    const initState = switch.initState;
  ```

  ### state
  Indicates current state of the component, by default `state` receives value from the `offLabel` property. 
  Initial state can be set using `init-state` attribute on the component via HTML. Although this property is duplicated as HTML attribute on the component, it can not be manipulated directly via HTML. It's rather used in order to be some sort of indication of the component's current state, you can use it as a hook in your CSS.
  ```javascript
    // set property value
    const switch = document.getElementById("switch");
    switch.state = "open";
  ```
  
  **NOTE:** `state` property, if not set explicitly or via `init-state` property on the element's creation, will get its default value from the `offLabel` property (see below). It will be changed on each click of the component and get a value from the `onLabel` and `offLabel` properties respectively.
  
  ### disabled
  Indicates that component is disabled.
  When applied, component sets `aria-disabled="true"`, removes focus and can not be interacted by the user.
  ```javascript
    // set property value
    const switch = document.getElementById("switch");
    switch.disabled = true;
  ```

  ### elastic
  Indicates that component's should apply elastic style on its lever. When clicked its lever will get an elastic style and animation.
  ```javascript
    // set property value
    const switch = document.getElementById("switch");
    switch.elastic = true;
  ```

  ### on-label
  Changes default label when element is in the active state (e.g. "on").
   ```javascript
    // set property value
    const switch = document.getElementById("switch");
    switch.onLabel = "open";
  ```
  
  ### off-label
  Changes default label when element is in the inactive state (e.g. "off").
   ```javascript
    // set property value
    const switch = document.getElementById("switch");
    switch.offLabel = "close";
  ```
  
## Events

  ### change Event
  This event is fired when component is clicked and its `state` property is changed.
  You can determine current state by reading `event.detail.state` property. This event bubbles up through the DOM.
   ```javascript
    document.querySelector("switch-component").addEventListener("change", function (e) {
      const currentState = e.detail.state;
      console.log("from switch-component CHANGE EVENT");
    });
  ```
  
## Style

  ### Custom styles
  You can customize component, by setting your css on the component itself and by using CSS custom properties (a.k.a CSS variables). Component has built-in support for the RTL (left-to-right) styling.
  
  **NOTE:** component's dimension properties mainly defined in `em` unit (this unit is relative to the `font-size` property that defined on the element itself or on the parent element), thus, you can change its dimensions by setting `font-size` on the component itself or on the parent element.
  ```css
    switch-component {
      width: 50px;
      margin: 2rem;
      --switch-lever--background: red;
      --switch-lever_checked--background: cornflowerblue;
      --switch-lever--handle-background: yellow;
      --switch-lever_checked--handle-background: yellow;
      --switch-lever_active--handle-box-shadow: pink;
      --switch--on-text-color: rgb(158 158 158);
      --switch--off-text-color: rgb(205 92 92);
      --switch_checked--on-text-color, rgb(112 179 173);
      --switch_checked--off-text-color, rgb(158 158 158);
      --switch_focus--background: yellow;
      --switch_focus--outline-color: firebrick;
    }
  ```
  ### CSS custom properties
  The following properties can be used to customize the component:
  
   #### --switch-lever--background
   Sets `background` on the component's lever. [default value: rgb(230, 230, 230)]
   
   #### --switch-lever_checked--background
   Sets `background` on the component's lever when component is in **active** state. [default value: rgb(125, 200, 193)]
   
   #### --switch-lever--handle-background
   Sets `background` on the component lever's handle. [default value: rgb(247, 245, 245)]
   
   #### --switch-lever_checked--handle-background
   Sets` background` on the component lever's handle when component is in **active** state. [default value: rgb(112, 179, 173)]
   
   #### --switch-lever_active--handle-box-shadow
   Sets `box-shadow` on the component lever's handle when component is clicked. [default value: rgba(38,166,154,0.1)]
   
   #### --switch--on-text-color
   Sets **default** `color` of the component's `on-label`. [default value: rgb(158, 158, 158)] 
   
   #### --switch--off-text-color
   Sets **default** `color` of the component's `off-label`. [default value: rgb(205, 92, 92)] 
  
   #### --switch_checked--on-text-color
   Sets `color` of the component's `on-label` when label is **active**. [default value: rgb(112, 179, 173)]
   
   #### --switch_checked--off-text-color
   Sets `color` of the component's `off-label` when label is **active**. [default value: rgb(158, 158, 158)]
   
   #### --switch_disabled--on-text-color
   Sets `color` of the component's `on-label` when component is in the **disabled** state. [default value: rgb(158, 158, 158)]
   
   #### --switch_disabled--off-text-color
   Sets `color` of the component's `off-label` when component is in the **disabled** state. [default value: rgb(158, 158, 158)]
   
   #### --switch_focus--background
   Sets `background` on the component lever's when component is in the **focus** state. [default value: rgb(255 255 255)]
   
   #### --switch_focus--outline-color
   Sets `color` of the `outline` on the component lever's when component is in the **focus** state. [default value: rgb(100, 149, 237)]
   
   #### --switch_focus--outline-color
   Sets `color` of the `outline` on the component lever's when component is in the **focus** state. [default value: rgb(100, 149, 237)]
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
