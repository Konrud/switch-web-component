;(function () {
  "use strict";
  
  class SwitchComponent extends HTMLElement {
    
    constructor () {
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.appendChild(_getHtmlContent());

      this._onSwitcherChange = this._onSwitcherChange.bind(this);
      this._onSwitchContainerKeyDown = this._onSwitchContainerKeyDown.bind(this);
      this._onSwitchContainerKeyUp = this._onSwitchContainerKeyUp.bind(this);
      
      this._switcher = this.shadowRoot.getElementById("switcher");
      this._switchLever = this.shadowRoot.getElementById("switchLever");
      this._switchContainer = this.shadowRoot.getElementById("switchContainer");
    }
    
    static get observedAttributes () {
      return ["elastic", "on-label", "off-label", "disabled"];
    }
    
    connectedCallback (e) {

      if(!this.hasAttribute("role")) {
        this.setAttribute("role", "switch");
      } 
      if(!this.hasAttribute("aria-checked")) {
        this.setAttribute("aria-checked", "false");
      }
      
      if(this._switcher) {
        this._switcher.addEventListener("change", this._onSwitcherChange);
      }
     
      if(this._switchContainer) {
        this._switchContainer.addEventListener("keydown", this._onSwitchContainerKeyDown, true);
        this._switchContainer.addEventListener("keyup", this._onSwitchContainerKeyUp, true);
      }
      
      // set initial value for the state
      this.setAttribute("state", this.state);
      
      // A user may set a property on an _instance_ of an element,
      // before its prototype has been connected to this class.
      // The `_upgradeProperty()` method will check for any instance properties
      // and run them through the proper class setters.
      // See the [lazy properites](/web/fundamentals/architecture/building-components/best-practices#lazy-properties)
      // section for more details.
      this._upgradeProperty("state");
      this._upgradeProperty("disabled");
      this._upgradeProperty("elastic");
      this._upgradeProperty("onLabel");
      this._upgradeProperty("offLabel");
      
      const initStateValue = this.getAttribute("init-state");
      
      // initial state set at the initialization state via HTML
      if(initStateValue !== null && this._switcher && (initStateValue === this.onLabel)) {
         this._switcher.click();
      }
    }
    
    disconnectedCallback (e) {
      // run clean up code here
      if(this._switcher) {
        this._switcher.removeEventListener("change", this._onSwitcherChange);
      }
      
      if(this._switchContainer) {
        this._switchContainer.removeEventListener("keydown", this._onSwitchContainerKeyDown, true);
        this._switchContainer.removeEventListener("keyup", this._onSwitchContainerKeyUp, true);
      }
      
      this._switcher = null;
      this._switchLever = null;
      this._switchContainer = null;
      this._onSwitcherChange = null;
      this._onSwitchContainerKeyDown = null;
      this._onSwitchContainerKeyUp = null;
    }
    
    attributeChangedCallback (name, prevVal, curVal) {
      if(name === "elastic") {
         this._handleElasticAttributeChange(this.elastic);
      } 
      
      if(name === "disabled") {
        this._handleDisabledAttributeChange(this.disabled);
      }
      
      if(name === "on-label") {
        this.onLabel = curVal;
      }
      
      if(name === "off-label") {
        this.offLabel = curVal;
      }
    }
    
    /**===  name ===**/
    get name () {
      return this.getAttribute("name");
    }
    
    /**===  initState ===**/
    get initState () {
      return this.getAttribute("init-state");
    }
    
    /**===  state ===**/
    get state () {
      return this.getAttribute("state") || this.offLabel;
    }
    
    set state (val) {
      if(!val || val === this.state) return;
      
      this.setAttribute("state", val);

      if(this._switcher) {
        this._switcher.click();
      }
    }
    
    /**===  disabled ===**/
    get disabled () {
      return this.hasAttribute("disabled");
    }

    set disabled (val) {
      if(val !== true && val !== false) return;
      
      if(val === true) {
         this.setAttribute("disabled", "");
      } else {
         this.removeAttribute("disabled");
      }
    }
    
    /**===  elatic ===**/
    get elastic () {
      return this.hasAttribute("elastic");
    }
    
    set elastic (val) {
      if(val) {
        this.setAttribute("elastic", "");
      } else {
        this.removeAttribute("elastic");
      }
    }
    
    /**===  onLabel ===**/
    get onLabel () {
      const onTextElem = this.shadowRoot.querySelector(".switch__on-text");
      if(onTextElem) {
        return onTextElem.textContent;
      }
    }
    
    set onLabel (val) {
      if(val) {
        const onTextElem = this.shadowRoot.querySelector(".switch__on-text");
        if(onTextElem) {
          onTextElem.textContent = val;
        }
      }
    }
    
    /**===  offLabel ===**/
    get offLabel () {
      const offTextElem = this.shadowRoot.querySelector(".switch__off-text");
      if(offTextElem) {
        return offTextElem.textContent;
      }
    }
    
    
    set offLabel (val) {
      if(val) {
        const offTextElem = this.shadowRoot.querySelector(".switch__off-text");
        if(offTextElem) {
          offTextElem.textContent = val;
        }
      }
    }

     /*===========================
     PRIVATE FUNCTIONS 
     =============================*/
    _handleElasticAttributeChange(isElastic) {
      const switchContainer = this.shadowRoot.querySelector(".switch");
      if(isElastic && switchContainer) {
        switchContainer.classList.add("switch--elastic");
      } else if (switchContainer) {
        switchContainer.classList.remove("switch--elastic");
      }
    }
    
    _handleDisabledAttributeChange(isDisabled) {
      this._setAriaDisabled(this, isDisabled);
      
      if(this._switcher) {
        this._switcher.disabled = isDisabled;
        if(isDisabled) { // remove focus / change document.activeElement
          this.blur();
          this._switcher.blur();
        }
      }
    }
    
    _upgradeProperty (prop) {
      if(this.hasOwnProperty(prop)) {
        const val = this[prop];
        delete this[prop];
        this[prop] = val;
      }
    }
    
    _setAriaDisabled(elem, value) {
      if(value !== true && value !== false) return;
      
      if(value === true) {
         elem.setAttribute("aria-disabled", value);
      } else {
        elem.removeAttribute("aria-disabled");
      }
    }
    
    /**
    * Creates and dispateches Custom "Change" Event
    *  @param {Object} externalEventArgs - Event arguments from the external source (like external event) [optional]
    **/
    _dispatchCustomChangeEvent (externalEventArgs) {
      const customEventArgs = {
        detail: {
          state: this.state
        },
        bubbles: true
      };
      
      const customChangeEvent = new CustomEvent("change", customEventArgs);
      
      this.dispatchEvent(customChangeEvent);
    }
    
     /*===========================
     PRIVATE EVENT HANDLERS 
     =============================*/
    _onSwitcherChange (e) {
      const switcher = e.currentTarget;
      this.setAttribute("aria-checked", switcher.checked);
      const newState = switcher.checked ? this.onLabel : this.offLabel;
      this.setAttribute("state", newState);
      this._dispatchCustomChangeEvent();
    }
    
    _onSwitchContainerKeyDown (e) {
      // handle only "space" key
      if(e.keyCode === 32) {
        this._switchLever.classList.add("is-active");
      }
    }
    
    _onSwitchContainerKeyUp (e) {
      // handle only "space" key
      if(e.keyCode === 32) {
        this._switchLever.classList.remove("is-active");
      }
    }
    
  };
  
  /**Utility Methods**/ 
  function _getHtmlContent() {
    const styles = _getCssContent();
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
      ${styles}
      </style>
      <label class="switch jsSwitcher" id="switchContainer" role="switch" aria-label="regular switch">
        <input type="checkbox" class="off-screen" name="switcher" id="switcher" aria-hidden="true" />
        <span class="switch__off-text">off</span>
        <span class="switch__lever" id="switchLever" aria-hidden="true"></span>
        <span class="switch__on-text">on</span>
      </label>
      `;
    return template.content.cloneNode(true);
  };
  
  function _getCssContent () {
    return `
    /**
      Initial style of the switch-component
      1. Nothing outside the element may affect its internal layout & vice versa.
    **/
    :host {
      display: inline-block;
      contain: layout; /*[1]*/
      --switch-lever--background: rgb(230, 230, 230);
      --switch-lever_checked--background: rgb(125, 200, 193);
      --switch-lever--handle-background: rgb(247, 245, 245);
      --switch-lever_checked--handle-background: rgb(112, 179, 173);
      --switch-lever_active--handle-box-shadow: rgba(38,166,154,0.1);
      --switch--on-text-color: rgb(158, 158, 158);
      --switch--off-text-color: rgb(205, 92, 92);
      --switch_checked--on-text-color: rgb(112, 179, 173);
      --switch_checked--off-text-color: rgb(158, 158, 158);
      --switch_focus--background: rgb(255 255 255);
      --switch_focus--outline-color: rgb(100, 149, 237);
      --switch_disabled--off-text-color: rgb(158, 158, 158);
      --switch_disabled--on-text-color: rgb(158, 158, 158);
    }
    
    :host([hidden]) {
      display: none;
    }
    
    :host([disabled]) {
      opacity: 0.7;
      cursor: not-allowed;
      pointer-events: none;
    }

    :host(:focus) {
      outline: none;
    }
    
    .switch {
      position: relative;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    /**focus state**/
    .switch [type=checkbox]:not(:hover):not(:active):focus ~ .switch__lever {
     box-shadow: 1px 0 2px rgb(197 195 195) inset, -1px 1px 4px rgb(197 195 195) inset, 0px 0px 0 8px var(--switch_focus--background, rgb(255 255 255)), 0px 0px 0 9px var(--switch_focus--outline-color, rgb(100, 149, 237));
    }
    
    /**switch lever**/
    .switch__lever {
      position: relative;
      display: inline-block;
      width: 3.75em; /*60px*/
      height: 1.25em; /*20px*/
      margin: 0 0.625em; /*0 10px*/
      border-radius: 1.25em;
      vertical-align: middle;
      background: var(--switch-lever--background, rgb(230 230 230));
      box-shadow: 1px 0 2px rgb(197 195 195) inset, -1px 1px 4px rgb(197 195 195) inset;
      transition: background .1s;
    }

    .switch__lever::before {
      content: "";
      position: absolute;
      top: -0.3125em;/*-5px*/
      left: -0.125em;/*-2px*/
      width: 1.875em;/*30px*/
      height: 1.875em;/*30px*/
      border-radius: 50%;
      background: var(--switch-lever--handle-background, rgb(247, 245, 245));
      box-shadow: 1px 1px 4px rgba(0, 0, 0, .4);
      transition: transform .1s ease;
    }

    :host([dir="rtl"]) .switch .switch__lever::before {
      left: initial;
      right: -0.125em;/*-2px*/
    }

    :dir(rtl) .switch .switch__lever::before {
      left: initial;
      right: -0.125em;/*-2px*/
    }

    .switch__lever:active::before {
      box-shadow: 0 0.0625em 0.1875em 0.0625em rgba(0,0,0,0.4),0 0 0 0.625em var(--switch-lever_active--handle-box-shadow, rgba(38,166,154,0.1));
    }

    [type="checkbox"]:checked ~ .switch__lever {
      background: var(--switch-lever_checked--background, rgb(125, 200, 193));
    }

    [type="checkbox"]:checked ~ .switch__lever:before {
      transform: translateX(111%);
      background: var(--switch-lever_checked--handle-background, rgb(112, 179, 173));
    }

    :host([dir="rtl"]) .switch [type="checkbox"]:checked ~ .switch__lever:before {
      transform: translateX(-111%);
    }

    :dir(rtl) .switch [type="checkbox"]:checked ~ .switch__lever:before {
      transform: translateX(-111%);
    }

    /**switch on-text**/
    .switch__on-text {
      color: var(--switch--on-text-color, rgb(158, 158, 158));
    }

    [type="checkbox"]:checked ~ .switch__on-text {
      color: var(--switch_checked--on-text-color, rgb(112, 179, 173));
    }
    
    :host([disabled]) .switch__off-text {
      color: var(--switch_disabled--on-text-color, rgb(158, 158, 158));
    }
    
    /**switch off-text**/
    .switch__off-text {
      color: var(--switch--off-text-color, rgb(205, 92, 92));
    }

    [type="checkbox"]:checked ~ .switch__off-text {
      color: var(--switch_checked--off-text-color, rgb(158, 158, 158));
    }
    
    :host([disabled]) .switch__off-text {
      color: var(--switch_disabled--off-text-color, rgb(158, 158, 158));
    }

    /*START Elastic switch*/
    .switch--elastic [type="checkbox"]:checked ~ .switch__lever {
      transition-delay: .1s; /*for smoother background animation*/
    }

    .switch--elastic:active .switch__lever::before,
    .switch--elastic .switch__lever.is-active::before {
      width: 2.3em; 
    }

    .switch--elastic .switch__lever::before {
      transition: transform .3s, left .3s, width .3s;
    }

    .switch--elastic [type="checkbox"]:checked ~ .switch__lever::before {
      transform: translateX(-100%);
      left: 100%;
    }
    /*END Elastic switch*/
    
    .off-screen { /*another name for this class could be visually-hidden*/
      position: fixed; /*we can set it as fixed, that will prevent jumping when it's clicked/targeted (but it will screw up focusing on the element)*/
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      border: none;
      overflow: hidden;
      clip-path: inset(100%);
      clip: rect(0 0 0 0); /*depreceted, only for IE9-11*/
      white-space: nowrap; /*For long content, line feeds are not interpreted as spaces and small width causes content to wrap 1 word per line: https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe*/
    }
    `;
  }
  
   customElements.define("switch-component", SwitchComponent);
  
})();
