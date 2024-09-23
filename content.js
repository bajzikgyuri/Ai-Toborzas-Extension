// content.js

(function() {
  // Utility function to extract the ID from the URL
  function getMyIdFromUrl(url) {
    if (!url) {
      console.error('URL is undefined');
      return null;
    }
    const match = url.match(/\/(?:toborzasok|toborzas)\/([a-z0-9-]+)/);
    if (match) {
      return match[1];
    }
    return null;
  }

  // Function to wait for an element to be available in the DOM
  function waitForElement(selector) {
    return new Promise((resolve) => {
      const element = document.querySelector(selector);
      if (element) {
        return resolve(element);
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  // Function to add a button to the header
  async function addButtonToHeader() {
    const url = window.location.href;
    const id = getMyIdFromUrl(url);
    if (!id) return;

    let headerElement;
    if (url.includes('/toborzasok/')) {
      // Wait for the header element to be available
      headerElement = await waitForElement('#__next > div > div:nth-child(1) > div:nth-child(2) > div > div > div > div:nth-child(1)');
    } else if (url.includes('/toborzas/')) {
      headerElement = await waitForElement('#main-content > header > div.actions');
    } else {
      return;
    }

    if (!headerElement) {
      return;
    }

    if (document.querySelector('#ai-toborzas-start-button')) {
      return;
    }

    const buttonContainer = createButtonContainer();
    const button = createButton();

    buttonContainer.appendChild(button);

    if (url.includes('/toborzasok/')) {
      headerElement.style.display = 'flex';
      headerElement.style.alignItems = 'center';
      headerElement.style.justifyContent = 'center';
      headerElement.appendChild(buttonContainer);
    } else if (url.includes('/toborzas/')) {
      headerElement.insertBefore(buttonContainer, headerElement.firstChild);
    }

    button.addEventListener('click', () => handleButtonClick(buttonContainer, button));
  }

  // Function to remove the button if it exists
  function removeButton() {
    const existingButton = document.querySelector('#ai-toborzas-start-button');
    if (existingButton) {
      existingButton.remove();
    }
  }

  // Function to create button container
  function createButtonContainer() {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'v-button secondary rounded ai-toborzas-start-button';
    buttonContainer.id = 'ai-toborzas-start-button';
    return buttonContainer;
  }

  // Function to create the button
  function createButton() {
    const button = document.createElement('button');
    button.className = 'button align-center icon normal ai-toborzas-button';
    button.type = 'button';
    button.innerHTML = '<span class="content"><span class="v-icon"><i data-icon="magic_wand">🪄</i></span></span>';
    return button;
  }

  // Function to handle button click
  function handleButtonClick(buttonContainer, button) {
    const myId = getMyIdFromUrl(window.location.href);
    if (myId) {
      showLoading(buttonContainer);
      fetch(`https://prod-n8n.polandcentral.cloudapp.azure.com/webhook/ai-toborzas-start-from-sales?toborzas_id=${myId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error occurred: ${response.status} ${response.statusText}`);
          }
          return response.text();
        })
        .then(text => {
          let data;
          try {
            data = JSON.parse(text);
            processResponseData(data);
          } catch (error) {
            displayModal(text);
          }
        })
        .catch(error => {
          console.error("Fetch error:", error);
          displayError(error.message);
        })
        .finally(() => {
          hideLoading(buttonContainer, button);
        });
    }
  }

  // Function to display plain text in a modal dialog
  function displayModal(message) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';

    const messageElement = document.createElement('div');
    messageElement.className = 'modal-message';
    messageElement.textContent = message;

    const okButton = document.createElement('button');
    okButton.className = 'button-primary';
    okButton.textContent = 'OK';
    okButton.addEventListener('click', () => {
      overlay.remove();
    });

    modalContainer.appendChild(messageElement);
    modalContainer.appendChild(okButton);
    overlay.appendChild(modalContainer);

    document.body.appendChild(overlay);
  }

  // Function to process the response data
  function processResponseData(data) {
    try {
      const responseData = data[""];
      if (!responseData || !Array.isArray(responseData) || responseData.length < 2) {
        throw new Error('Invalid data structure');
      }

      const postContent = findNestedProperty(responseData[0], 'poszt_szoveg') || findNestedProperty(responseData[0], 'content.text');
      const driveFile = findNestedProperty(responseData[1], 'id');

      const processedData = {
        post: postContent,
        id: driveFile
      };

      notifyUser('A folyamat sikeres volt!');
      displayResponse(processedData);
    } catch (error) {
      console.error("Error processing data:", error);
      displayError('Error processing response data: ' + error.message);
    }
  }

  // Function to show loading spinner
  function showLoading(container) {
    const loader = document.createElement('div');
    loader.className = 'loader';
    container.innerHTML = '';
    container.appendChild(loader);
  }

  // Function to hide loading spinner
  function hideLoading(container, button) {
    container.innerHTML = '';
    container.appendChild(button);
  }

  // Function to notify user
  function notifyUser(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Function to display response in an overlay
  function displayResponse(data) {
    const overlay = createOverlay();
    const responseContainer = createResponseContainer();
    const content = createResponseContent();
    const message = createMessageElement('Hirdetés:');
    const facebookPostContainer = createFacebookPostContainer(data);
    const buttonContainer = createResponseButtonContainer(data);

    content.appendChild(message);
    content.appendChild(facebookPostContainer);
    responseContainer.appendChild(content);
    responseContainer.appendChild(buttonContainer);
    overlay.appendChild(responseContainer);
    document.body.appendChild(overlay);
  }

  // Function to create overlay
  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    return overlay;
  }

  // Function to create response container
  function createResponseContainer() {
    const responseContainer = document.createElement('div');
    responseContainer.id = 'response-container';
    responseContainer.className = 'response-container';
    return responseContainer;
  }

  // Function to create response content
  function createResponseContent() {
    const content = document.createElement('div');
    content.className = 'response-content';
    return content;
  }

  // Function to create message element
  function createMessageElement(text) {
    const message = document.createElement('div');
    message.className = 'response-message';
    message.textContent = text;
    return message;
  }

  // Function to create Facebook post container
  function createFacebookPostContainer(data) {
    const facebookPostContainer = document.createElement('div');
    facebookPostContainer.className = 'facebook-post-container';
    try {
      const postContent = data.post;
      if (postContent) {
        facebookPostContainer.innerHTML = postContent.replace(/\n/g, '<br>');
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (error) {
      console.error('Error processing response data:', error);
      facebookPostContainer.textContent = 'Error occurred while processing the data.';
    }
    return facebookPostContainer;
  }

  // Function to create response button container
  function createResponseButtonContainer(data) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'response-button-container';

    const leftButtonContainer = createLeftButtonContainer(data);
    const closeButton = createCloseButton();

    buttonContainer.appendChild(leftButtonContainer);
    buttonContainer.appendChild(closeButton);
    return buttonContainer;
  }

  // Function to create left button container
  function createLeftButtonContainer(data) {
    const leftButtonContainer = document.createElement('div');
    leftButtonContainer.className = 'left-button-container';

    try {
      const driveFile = data.id;
      if (driveFile) {
        const link = `https://drive.google.com/uc?export=download&id=${driveFile}`;

        const downloadButton = createDownloadButton(link);
        leftButtonContainer.appendChild(downloadButton);
      } else {
        throw new Error('Invalid file data structure');
      }
    } catch (error) {
      console.error('Error processing file data:', error);
    }

    const copyTextButton = createCopyTextButton(data);
    leftButtonContainer.appendChild(copyTextButton);
    return leftButtonContainer;
  }

  // Function to create download button
  function createDownloadButton(link) {
    const downloadButton = document.createElement('button');
    downloadButton.className = 'button-download';
    downloadButton.textContent = 'Kép letöltés';
    downloadButton.addEventListener('click', () => {
      window.open(link, '_blank');
    });
    return downloadButton;
  }

  // Function to create copy text button
  function createCopyTextButton(data) {
    const copyTextButton = document.createElement('button');
    copyTextButton.className = 'button-copy';
    copyTextButton.textContent = 'Szöveg másolása';
    copyTextButton.addEventListener('click', () => {
      const textToCopy = data.post || '';
      navigator.clipboard.writeText(textToCopy).then(() => {
        notifyUser('Szöveg másolva!');
      }).catch(err => {
        console.error('Error copying text:', err);
        notifyUser('Hiba történt a szöveg másolása közben.');
      });
    });
    return copyTextButton;
  }

  // Function to create close button
  function createCloseButton() {
    const closeButton = document.createElement('button');
    closeButton.className = 'button-close';
    closeButton.textContent = 'Bezárás';
    closeButton.addEventListener('click', () => {
      const overlay = document.querySelector('.overlay');
      if (overlay) {
        overlay.remove();
      }
    });
    return closeButton;
  }

  // Utility function to find a nested property in an object
  function findNestedProperty(obj, key) {
    if (typeof obj !== 'object' || obj === null) {
      return null;
    }
    if (obj.hasOwnProperty(key)) {
      return obj[key];
    }
    for (const k in obj) {
      if (obj.hasOwnProperty(k) && typeof obj[k] === 'object') {
        const result = findNestedProperty(obj[k], key);
        if (result !== null) {
          return result;
        }
      }
    }
    return null;
  }

  // Function to initialize the script
  function init() {
    let lastUrl = '';
    setInterval(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        // Check if the URL matches
        const id = getMyIdFromUrl(currentUrl);
        if (id) {
          addButtonToHeader();
        } else {
          removeButton();
        }
      } else {
        // Even if the URL hasn't changed, check if the button is missing and should be added
        const id = getMyIdFromUrl(currentUrl);
        if (id && !document.querySelector('#ai-toborzas-start-button')) {
          addButtonToHeader();
        }
      }
    }, 1000);
  }

  // Initialize the script
  init();
})();
