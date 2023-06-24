export default (() => {
  const SELECTOR = 'example-content';

  if (!!customElements.get(SELECTOR)) {
    return;
  }

  class el extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
				<style>:host {display:block; color: green;}</style>
				<div class="content">
					<slot><p>Some Content</p></slot>
				</div>
			`;
    }

    static get observedAttributes() {
      return ['theme'];
    }

    connectedCallback() {
      this.className = this.getAttribute('theme');
    }

    attributeChangedCallback() {
      this.connectedCallback();
    }
  }

  customElements.define(SELECTOR, el);
})();
