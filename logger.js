(() => {
    const log = [];
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
  
    let currentSpeaker = "Unknown";
  
    // Detect speaker name from Zoom UI
    function detectSpeaker() {
      const speakerLabel = document.querySelector('[aria-label*="is talking"]');
      if (speakerLabel) {
        const match = speakerLabel.getAttribute("aria-label").match(/^(.*) is talking/);
        if (match && match[1]) {
          currentSpeaker = match[1];
          return;
        }
      }
  
      const selfNameElem = document.querySelector('[data-self-name]');
      if (selfNameElem) {
        const name = selfNameElem.getAttribute('data-self-name');
        if (name) {
          currentSpeaker = name;
        }
      }
    }
  
    // Update current speaker every second
    const speakerInterval = setInterval(detectSpeaker, 1000);
  
    // Start voice recognition
    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const text = event.results[i][0].transcript.trim();
          const timestamp = new Date().toLocaleTimeString();
          const entry = `[${timestamp}] ${currentSpeaker}: ${text}`;
          log.push(entry);
          console.log(entry);
        }
      }
    };
  
    recognition.start();
  
    // Stop and send log
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "stop-logging") {
        recognition.stop();
        clearInterval(speakerInterval);
  
        const blob = new Blob([log.join('\n')], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const filename = `zoom_log_${Date.now()}.txt`;
  
        chrome.runtime.sendMessage({ action: "download", url, filename });
      }
    });
  })();
  