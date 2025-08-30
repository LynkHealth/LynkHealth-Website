// Test if basic JavaScript works
console.log("main.tsx is loading");

const rootElement = document.getElementById("root");
console.log("Root element found:", rootElement);

if (rootElement) {
  rootElement.innerHTML = "<h1>JavaScript is working</h1><p>Basic HTML injection test</p>";
  console.log("HTML injected successfully");
}
