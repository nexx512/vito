import * as components from "./components";

function initializeComponents() {
  const nodes = document.querySelectorAll("[data-component]");

  nodes.forEach(node => {
    const componentName = node.getAttribute("data-component")
    components[componentName](node);
  })

}

initializeComponents();
