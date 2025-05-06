document.getElementById("start").onclick = () => {
    chrome.runtime.sendMessage({ action: "start-logging" });
    document.getElementById("status").textContent = "✅ Logging started...";
  };
  
  document.getElementById("stop").onclick = () => {
    chrome.runtime.sendMessage({ action: "stop-logging" });
    document.getElementById("status").textContent = "📁 Log downloading...";
  };
  